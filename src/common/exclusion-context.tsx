import React, { Dispatch, SetStateAction, useContext } from "react";
import { useLocalStorage } from "./use-local-storage";

const exclusionListInit: string[] = [];

const contextInit: [string[], Dispatch<SetStateAction<string[]>>] = [
  exclusionListInit,
  () => {},
];

const ExclusionListContext = React.createContext(contextInit);

export const ExclusionListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storage = useLocalStorage("exclusion-list", exclusionListInit);

  return (
    <ExclusionListContext.Provider value={storage}>
      {children}
    </ExclusionListContext.Provider>
  );
};

export const useExclusionList = () => useContext(ExclusionListContext);
