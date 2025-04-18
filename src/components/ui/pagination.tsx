import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

// Legacy pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // Helper function to create an array of page numbers to display
  const generatePagination = () => {
    // Always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;

    // Create a range of sibling pages around the current page
    const siblingStart = Math.max(firstPage, currentPage - siblingCount);
    const siblingEnd = Math.min(lastPage, currentPage + siblingCount);

    // Initialize our array with a reasonable initial capacity
    const pages: (number | string)[] = [];

    // Always add first page
    pages.push(firstPage);

    // Add ellipsis if there's a gap between first page and sibling start
    if (siblingStart > firstPage + 1) {
      pages.push("...");
    } else if (siblingStart === firstPage + 1) {
      // If the gap is just 1, show the page instead of ellipsis
      pages.push(firstPage + 1);
    }

    // Add all pages in the sibling range, excluding first and last if they're in the range
    for (let i = siblingStart; i <= siblingEnd; i++) {
      if (i !== firstPage && i !== lastPage) {
        pages.push(i);
      }
    }

    // Add ellipsis if there's a gap between sibling end and last page
    if (siblingEnd < lastPage - 1) {
      pages.push("...");
    } else if (siblingEnd === lastPage - 1) {
      // If the gap is just 1, show the page instead of ellipsis
      pages.push(lastPage - 1);
    }

    // Always add last page if it's different from first page
    if (lastPage !== firstPage) {
      pages.push(lastPage);
    }

    return pages;
  };

  const pages = generatePagination();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center space-x-1 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      {pages.map((page, i) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${i}`} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          );
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(Number(page))}
            className="min-w-[2.5rem]"
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-2"
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </nav>
  );
}

// New modular pagination components for shadcn/ui style usage
interface PaginationRootProps extends React.ComponentPropsWithoutRef<"nav"> {
  children?: React.ReactNode;
}

const PaginationRoot = React.forwardRef<
  HTMLElement,
  PaginationRootProps
>(({ className, children, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  >
    {children}
  </nav>
));
PaginationRoot.displayName = "PaginationRoot";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    isActive?: boolean;
  }
>(({ className, isActive, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "bg-transparent hover:bg-muted",
      className
    )}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn("h-9 w-9", className)}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
  </Button>
));
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn("h-9 w-9", className)}
    {...props}
  >
    <ChevronRightIcon className="h-4 w-4" />
  </Button>
));
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <span className="text-muted-foreground">...</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  PaginationRoot as Root,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}; 