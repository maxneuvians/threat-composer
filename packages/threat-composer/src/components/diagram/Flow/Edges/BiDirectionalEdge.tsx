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
import { memo } from 'react';
import { getBezierPath, BaseEdge, useStore, EdgeProps, ReactFlowState, EdgeLabelRenderer } from 'reactflow';

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number,
): [path: string, labelX: number, labelY: number] => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return [`M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`, centerX, centerY + offset];
};

export default memo(({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
  markerEnd,
}: EdgeProps) => {
  const isBiDirectionEdge = useStore((s: ReactFlowState) => {
    const edgeExists = s.edges.some(
      (e) =>
        (e.source === target && e.target === source) || (e.target === source && e.source === target),
    );

    return edgeExists;
  });

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  let path = '';
  let labelX: number = 0;
  let labelY: number = 0;

  if (isBiDirectionEdge) {
    [path, labelX, labelY] = getSpecialPath(edgePathParams, sourceX < targetX ? 25 : -25);
  } else {
    [path, labelX, labelY] = getBezierPath(edgePathParams);
  }

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{
        strokeWidth: 2,
        zIndex: 1,
        stroke: selected ? '#FF0072' : '#000',
      }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#ffcc00',
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
            zIndex: 2,
          }}
          className="nodrag nopan"
        >
          {data.name}
        </div>
      </EdgeLabelRenderer>
    </>);
});
