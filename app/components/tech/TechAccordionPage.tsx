import { Accordion } from "../Accordion";
import { AdminArrayItemsEditor } from "../admin/AdminArrayItemsEditor";
import { Pagination } from "../Pagination";
import { useAdminSession } from "../../hooks/useAdminSession";
import { usePaginatedItems } from "../../hooks/usePaginatedItems";
import type { AccordionItem } from "../../data/types";
import type { TechEntity, TechEntityField, TechPageCopy } from "./types";

const ITEMS_PER_PAGE = 6;

interface TechAccordionPageProps {
  copy: TechPageCopy;
  data: TechEntity;
  description: string;
  entityField: Extract<TechEntityField, "insights" | "interviewQuestions">;
  items: AccordionItem[];
  title: string;
}

export const TechAccordionPage = ({
  copy,
  data,
  description,
  entityField,
  items,
  title,
}: TechAccordionPageProps) => {
  const { isAdminAuthenticated } = useAdminSession();
  const { currentPage, paginatedItems, setCurrentPage } = usePaginatedItems(items, ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <Accordion items={paginatedItems} />

      <Pagination
        totalItems={items.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {isAdminAuthenticated ? (
        <div className="pt-12 border-t border-gray-100 dark:border-gray-800 mt-12">
          <AdminArrayItemsEditor
            title={title}
            description={description}
            items={items}
            entity={data}
            entityField={entityField}
            collection={copy.collection}
            itemId={data.slug}
          />
        </div>
      ) : null}
    </div>
  );
};
