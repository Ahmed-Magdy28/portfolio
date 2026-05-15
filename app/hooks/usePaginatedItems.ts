import { useMemo, useState } from "react";

export const usePaginatedItems = <T,>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [currentPage, items, itemsPerPage]);

  return {
    currentPage,
    paginatedItems,
    setCurrentPage,
  };
};
