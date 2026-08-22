import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const Pagepagination = ({
  page,
  numOfPages,
  increasePageValue,
  decreasePageValue,
}) => {
  return (
    <Pagination className="my-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) {
                decreasePageValue();
              }
            }}
          />
        </PaginationItem>

        <PaginationItem>
          <span className="px-4 py-2">
            {page} of {numOfPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < numOfPages) {
                increasePageValue();
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Pagepagination;