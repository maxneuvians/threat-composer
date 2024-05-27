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
import { DoubleArrowUpIcon, ArrowUpIcon, ArrowDownIcon, DoubleArrowDownIcon } from '@radix-ui/react-icons';
import { memo } from 'react';


type ZIndexChangerProps = {
  addCallback?: (name: string) => void;
};

const ZIndexChangerStyle = styled.div`
    border: 1px dashed #000;
    padding: 5px;
`;

export default memo(({ addCallback }: ZIndexChangerProps) => {
  return (
    <ZIndexChangerStyle>
      <DoubleArrowUpIcon role='button' aria-label='double-arrow-up-icon' onClick={() => addCallback && addCallback('first')}/>
      <ArrowUpIcon role='button' aria-label='arrow-up-icon' onClick={() => addCallback && addCallback('up')}/>
      <ArrowDownIcon role='button' aria-label='arrow-down-icon' onClick={() => addCallback && addCallback('down')}/>
      <DoubleArrowDownIcon role='button' aria-label='double-arrow-down-icon' onClick={() => addCallback && addCallback('last')}/>
    </ZIndexChangerStyle>
  );
});
