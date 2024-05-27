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
import { BoxIcon, CircleIcon, SectionIcon, TransparencyGridIcon } from '@radix-ui/react-icons';
import { memo } from 'react';


type NodeSelectorProps = {
  addCallback?: (name: string) => void;
};

const NodeSelectorStyle = styled.div`
    border: 2px solid #000;
    padding: 10px;
`;

export default memo(({ addCallback }: NodeSelectorProps) => {
  return (
    <NodeSelectorStyle>
      <BoxIcon role='button' aria-label='actor-icon' onClick={() => addCallback && addCallback('actor')}/>
      <CircleIcon role='button' aria-label='process-icon' onClick={() => addCallback && addCallback('process')}/>
      <SectionIcon role='button' aria-label='datastore-icon' onClick={() => addCallback && addCallback('datastore')}/>
      <TransparencyGridIcon role='button' aria-label='trust-boundary-icon' onClick={() => addCallback && addCallback('trustBoundary')}/>
    </NodeSelectorStyle>
  );
});
