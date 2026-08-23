"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsIndex, useQueryState } from "nuqs";
import { Button } from "../ui/button";
import { getPaginationNumbers } from "./paginationUtils";

type Props = {
  perPage: number;
  total: number;
};

export const usePage = () => {
  return useQueryState(
    "page",
    parseAsIndex.withDefault(0).withOptions({
      history: "push",
      scroll: true,
    })
  );
};

const FilterListPagination = (props: Props) => {
  const totalPages = Math.ceil(props.total / props.perPage);
  const [page, setPage] = usePage();
  if (totalPages < 2) return null;
  const paginationNumbers = getPaginationNumbers(page + 1, totalPages);
  return (
    <div className="flex flex-row gap-4">
      <Button
        variant="page"
        className="hidden desktop:block"
        onClick={() => setPage((prev) => prev - 1)}
        disabled={page === 0}
      >
        <ChevronLeft />
      </Button>
      {paginationNumbers.map((num, i) =>
        num ? (
          <Button
            variant="page"
            data-current={num === page + 1 ? true : undefined}
            key={num}
            onClick={() => setPage(num - 1)}
          >
            {num}
          </Button>
        ) : (
          <Button key={`ellipsis-${i}`} variant="page" disabled className="px-2">
            …
          </Button>
        )
      )}
      <Button
        variant="page"
        className="hidden desktop:block"
        onClick={() => setPage((prev) => prev + 1)}
        disabled={page === totalPages - 1}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default FilterListPagination;
