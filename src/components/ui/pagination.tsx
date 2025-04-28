import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from "./button";
import { cn } from "../../lib/utils";


// Legacy pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showControls?: boolean;
  showEdges?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showControls = true,
  showEdges = false,
}: PaginationProps) {
  // Generate page numbers to show
  console.log(showEdges);
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      // If 7 or less pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (currentPage <= 3) {
        // Near the start
        pageNumbers.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle - show current page, one before, and one after
        pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className="mx-auto flex w-full justify-center"
    >
      <ul className="flex flex-row items-center gap-1">
        {/* Previous page button */}
        {showControls && (
          <li>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </li>
        )}
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="flex h-8 w-8 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <Button
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(page as number)}
                disabled={currentPage === page}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </Button>
            )}
          </li>
        ))}
        
        {/* Next page button */}
        {showControls && (
          <li>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </li>
        )}
      </ul>
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
  HTMLLIElement,
  React.ComponentProps<typeof PaginationItem>
>(({ className, ...props }, ref) => (
  <PaginationItem
    ref={ref}
    aria-label="Go to previous page"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationItem>
));
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<typeof PaginationItem>
>(({ className, ...props }, ref) => (
  <PaginationItem
    ref={ref}
    aria-label="Go to next page"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationItem>
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
  PaginationContent as Content,
  PaginationItem as Item,
  PaginationLink as Link,
  PaginationEllipsis as Ellipsis,
}; 