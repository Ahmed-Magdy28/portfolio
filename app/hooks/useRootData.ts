import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

export const useRootData = () => {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");

  if (!rootData) {
    throw new Error("Root data is not available.");
  }

  return rootData;
};
