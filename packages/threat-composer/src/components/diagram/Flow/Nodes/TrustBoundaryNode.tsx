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
import styled from '@emotion/styled';
import { memo } from 'react';
import { NodeResizer } from 'reactflow';


type StyleProps = {
  selected: boolean;
};

const TrustBoundaryStyle = styled.div`
  border: 2px dashed ${(props: StyleProps) => (props.selected ? '#56bdf9' : '#f00')};
  background-color: ${(props: StyleProps) => (props.selected ? '#dbf1fe' : '#fff')};
  width: 99%;
  height: 99%;
  padding-left: 5px;
`;

const ResizableNodeSelected = ({ id, data, selected }: { id: string; data: any; selected: boolean } ) => {
  return (
    <>
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={100} nodeId={id} />
      <TrustBoundaryStyle selected={selected}>{data.name}</TrustBoundaryStyle>
    </>
  );
};

export default memo(ResizableNodeSelected);