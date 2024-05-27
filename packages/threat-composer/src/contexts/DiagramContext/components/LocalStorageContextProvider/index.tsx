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
import { FC, PropsWithChildren, useCallback } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { LOCAL_STORAGE_KEY_DIAGRAM_INFO } from '../../../../configs/localStorageKeys';
import { Diagram } from '../../../../customTypes';
import removeLocalStorageKey from '../../../../utils/removeLocalStorageKey';
import { DIAGRAM_DEFAULT_VALUE } from '../../../constants';
import { DiagramContext } from '../../context';
import { DiagramContextProviderProps } from '../../types';

const getLocalStorageKey = (workspaceId: string | null) => {
  if (workspaceId) {
    return `${LOCAL_STORAGE_KEY_DIAGRAM_INFO}_${workspaceId}`;
  }

  return LOCAL_STORAGE_KEY_DIAGRAM_INFO;
};

const DiagramLocalStorageContextProvider: FC<PropsWithChildren<DiagramContextProviderProps>> = ({
  children,
  workspaceId: currentWorkspaceId,
}) => {
  const [diagram, setDiagram, { removeItem }] = useLocalStorageState<Diagram>(getLocalStorageKey(currentWorkspaceId), {
    defaultValue: DIAGRAM_DEFAULT_VALUE,
  });

  const handleRemoveDiagram = useCallback(async () => {
    removeItem();
  }, [removeItem]);

  const handleDeleteWorkspace = useCallback(async (workspaceId: string) => {
    window.setTimeout(() => {
      // to delete after the workspace is switched. Otherwise the default value is set again.
      removeLocalStorageKey(getLocalStorageKey(workspaceId));
    }, 1000);
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

export default DiagramLocalStorageContextProvider;

