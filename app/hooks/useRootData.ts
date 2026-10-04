'use client';

import { useRootDataContext } from "../context/RootDataContext";

export const useRootData = () => {
  return useRootDataContext();
};
