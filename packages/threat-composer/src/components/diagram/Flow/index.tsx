/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 ******************************************************************************************************************** */
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import styled from '@emotion/styled';
import { FC, useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useEdgesState,
  useNodesState,
  ConnectionMode,
  Panel,
  Node,
  Edge,
  ReactFlowInstance,
  useReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
} from 'reactflow';
import { v4 } from 'uuid';
import 'reactflow/dist/style.css';

import BiDirectionalEdge from './Edges/BiDirectionalEdge';
import ActorNode from './Nodes/ActorNode';
import DatastoreNode from './Nodes/DatastoreNode';
import NodeSelector from './Nodes/NodeSelector';
import ProcessNode from './Nodes/ProcessNode';
import TrustBoundaryNode from './Nodes/TrustBoundaryNode';

import ZIndexChanger from './Nodes/ZIndexChanger';
import PropertiesPanel from './Properties/PropertiesPanel';
import SaveButton from './SaveButton/SaveButton';

import ThreatList from './Threats/ThreatList';


import { useDiagramContext, useThreatsContext } from '../../../contexts';
import { ViewNavigationEvent } from '../../../customTypes';

export interface FlowEditorProps {
  appMode?: string;
  onThreatListView?: ViewNavigationEvent['onThreatListView'];
}

const edgeTypes = {
  biDirectional: BiDirectionalEdge,
};

const nodeTypes = {
  actor: ActorNode,
  datastore: DatastoreNode,
  process: ProcessNode,
  trustBoundary: TrustBoundaryNode,
};

namespace s {
  export const OuterContainer = styled.div`
    height: 450px;
    display: flex;
    border: 1px solid #000;
    background-color: #fff;
    color: #000;

     svg.react-flow__edges {
      z-index: 1 !important;
     }
  `;
}

const Flow: FC<FlowEditorProps> = ({ onThreatListView }) => {

  const { zoomTo, getZoom, setViewport } = useReactFlow();

  // Save and restore state
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<any, any> | null>(null);
  const [saveState, setSaveState] = useState(true);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const { diagram, setDiagram } = useDiagramContext();

  const onSave = useCallback(() => {
    if (rfInstance) {
      setDiagram({ content: JSON.stringify(rfInstance.toObject()) });
      setSaveState(true);
    }
  }, [rfInstance, setDiagram]);

  const restoreFlow = useCallback(async () => {
    if (diagram.content) {
      const flow = JSON.parse(diagram.content || '{}');
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
    }
  }, [diagram.content, setNodes, setEdges, setViewport]);

  useEffect(() => {
    restoreFlow().catch(console.error);
  }, [diagram.content, restoreFlow]);

  const onInit = async (instance: any) => {
    setRfInstance(instance);
    await restoreFlow();
  };

  // Nodes and edges state
  const [nodeDataValue, setNodeDataValue] = useState({});
  const [selectedComponent, setSelectedComponent] = useState<Node | Edge | null>(null);

  useEffect(() => {
    if (!selectedComponent) {
      // If this is the first node added to the flow, zoom out to prevent an implicit max zoom (of 4)
      // this is probably another bug in react-flow that needs to be investigated and reported
      if (nodes.length === 1 && getZoom() === 4) {
        zoomTo(1);
      }
      return;
    }

    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === selectedComponent?.id) {
          edge.data = { ...edge.data, ...nodeDataValue };
        }
        return edge;
      }));
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedComponent?.id) {
          node.data = { ...node.data, ...nodeDataValue };
        }
        return node;
      }));
    setSaveState(false);
  }, [selectedComponent, nodeDataValue, setNodes, setEdges, getZoom, zoomTo, nodes.length]);

  const onNodesChange = useCallback(
    (changes: any) => {
      setNodeDataValue({});
      setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
      for (let selection of changes.filter((c: any) => c.type === 'select' || (c.type === 'position' && c.dragging === false) || c.type ==='remove')) {
        if (selection.selected || selection.dragging === false) {
          setSelectedComponent(nodes.find((node) => node.id === selection.id) as Node | null);
        } else {
          setSelectedComponent(null);
        }
      };
    },
    [nodes, setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      setNodeDataValue({});
      setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
      setSelectedComponent(null);
      for (let selection of changes.filter((c: any) => c.type === 'select')) {
        if (selection.selected) {
          setSelectedComponent(edges.find((edge) => edge.id === selection.id) as Edge | null);
        } else {
          setSelectedComponent(null);
        }
      }
    },
    [edges, setEdges],
  );

  const onConnect = useCallback(
    (params: any) => {
      const newEdge =
      {
        ...params,
        id: v4(),
        type: 'biDirectional',
        data: {
          name: 'Data',
          description: '',
          outOfScope: false,
          scopeReason: '',
          dataTags: [],
          techTags: [],
          securityTags: [],
          tags: [],
          selectedThreats: [],
        },
      };
      setEdges((eds) => addEdge(addEndMarker(newEdge), eds));
      setNodeDataValue({});
    }, [setEdges],
  );

  const onAdd = useCallback((type: string) => {
    setNodes((nds) => {
      // Randomize position for new nodes using a position from -100 to 100
      let x = Math.floor(Math.random() * 200) - 100;
      let y = Math.floor(Math.random() * 200) - 100;

      const newNode = {
        id: v4(),
        data: {
          name: type,
          description: '',
          outOfScope: false,
          scopeReason: '',
          dataTags: [],
          techTags: [],
          securityTags: [],
          tags: [],
          selectedThreats: [],
        },
        type,
        position: { x, y },
      };
      setSaveState(false);
      return [...nds, newNode];
    });
  }, [setNodes]);

  const onZIndexChange = useCallback((direction: string) => {
    setNodes((nds) => {
      const selectedNode = nds.find((node) => node.id === selectedComponent?.id);
      if (!selectedNode) {
        return nds;
      }
      const index = nds.indexOf(selectedNode);
      const newIndex = direction === 'last' ? 0 : direction === 'down' ? index - 1 : direction === 'up' ? index + 1 : nds.length - 1;
      const node = nds.splice(index, 1)[0];
      nds.splice(newIndex, 0, node);
      setSaveState(false);
      return [...nds];
    });
  }, [setNodes, selectedComponent]);

  // Threats state
  const { statementList } = useThreatsContext();
  const [threatList, setThreatList] = useState(statementList);

  useEffect(() => { // update list of threats panel
    setThreatList(statementList);
  }, [setThreatList, statementList]);

  const addEndMarker = (edge: any) => ({
    ...edge,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#b1b1b7',
    },
  });

  return (
    <SpaceBetween direction="vertical" size="s">
      <Container header={<Header actions={<SaveButton saveHandler={onSave} saveState={saveState} />}>Data flow diagram</Header>}>
        <s.OuterContainer>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            minZoom={0.2}
            maxZoom={4}
            fitView
            connectionMode={ConnectionMode.Loose}
            onInit={onInit}
          >
            <Background />
            <Controls />
            <Panel position="top-left"><NodeSelector addCallback={onAdd} /></Panel>
            <Panel position="top-right"><ZIndexChanger addCallback={onZIndexChange} /></Panel>
          </ReactFlow>
        </s.OuterContainer>
      </Container>
      <Container header={<Header>Properties</Header>}>
        <PropertiesPanel component={selectedComponent} changeHandler={setNodeDataValue} />
      </Container>
      <ThreatList
        threats={threatList}
        component={selectedComponent}
        changeHandler={setNodeDataValue}
        onThreatListView={onThreatListView} />
    </SpaceBetween>
  );
};

export default Flow;