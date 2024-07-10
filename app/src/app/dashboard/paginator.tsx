import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

function Paginator({
  pages,
  currentPage,
  prevPage,
  nextPage,
  currentQuery
}: {
  pages: number;
  currentPage: number;
  prevPage: number | null;
  nextPage: number | null;
  currentQuery?: string;
}) {

  const { currentPageLink, firstPageLink, lastPageLink, prevPageLink, nextPageLink } = useMemo(() => ({
    currentPageLink: currentQuery ? `/dashboard?q=${currentQuery}&p=${currentPage}` : `/dashboard?p=${currentPage}`,
    firstPageLink: currentQuery ? `/dashboard?q=${currentQuery}&p=1` : '/dashboard?p=1',
    lastPageLink: currentQuery ? `/dashboard?q=${currentQuery}&p=${pages}` : `/dashboard?p=${pages}`,
    prevPageLink: currentQuery ? `/dashboard?q=${currentQuery}&p=${prevPage}` : `/dashboard?p=${prevPage}`,
    nextPageLink: currentQuery ? `/dashboard?q=${currentQuery}&p=${nextPage}` : `/dashboard?p=${nextPage}`
  }), [currentPage, currentQuery, nextPage, pages, prevPage]);

  return (
    <Pagination className='w-fit mx-0'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={prevPageLink} className={cn(!prevPage && 'pointer-events-none opacity-50')} />
        </PaginationItem>
        {prevPage && 
          <PaginationItem className='hidden sm:block'>
            <PaginationLink href={firstPageLink}>1</PaginationLink>
          </PaginationItem>
        }
        {prevPage && (prevPage !== 1) && 
          <PaginationItem className='hidden sm:block'>
            <PaginationEllipsis />
          </PaginationItem>
        }
        <PaginationItem>
          <PaginationLink href={currentPageLink} isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {nextPage && (nextPage !== pages) &&
          <PaginationItem className='hidden sm:block'>
            <PaginationEllipsis />
          </PaginationItem>
        }
        {nextPage && 
          <PaginationItem className='hidden sm:block'>
            <PaginationLink href={lastPageLink}>{pages}</PaginationLink>
          </PaginationItem>
        }
        <PaginationItem>
          <PaginationNext href={nextPageLink} className={cn(!nextPage && 'pointer-events-none opacity-50')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default Paginator;