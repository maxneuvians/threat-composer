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
import { FC, PropsWithChildren, useCallback, useState } from 'react';
import { Diagram } from '../../../../customTypes';
import { DIAGRAM_DEFAULT_VALUE } from '../../../constants';
import { LocalStateContextProviderBaseProps } from '../../../types';
import { DiagramContext } from '../../context';
import { DiagramContextProviderProps } from '../../types';

const DiagramLocalStateContextProvider: FC<
PropsWithChildren<DiagramContextProviderProps & LocalStateContextProviderBaseProps<Diagram>>> = ({
  children,
  initialValue,
}) => {
  const [diagram, setDiagram] = useState<Diagram>(initialValue || DIAGRAM_DEFAULT_VALUE);

  const handleRemoveDiagram = useCallback(async () => {
    setDiagram(DIAGRAM_DEFAULT_VALUE);
  }, []);

  const handleDeleteWorkspace = useCallback(async (_workspaceId: string) => {
    setDiagram(DIAGRAM_DEFAULT_VALUE);
  }, []);

  return (<DiagramContext.Provider value={{
    diagram,
    setDiagram,
    removeDiagram: handleRemoveDiagram,
    onDeleteWorkspace: handleDeleteWorkspace,
  }}>
    {children}
  </DiagramContext.Provider>);
};

export default DiagramLocalStateContextProvider;

