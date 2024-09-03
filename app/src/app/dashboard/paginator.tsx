import EasySelect from '@/components/EasySelect';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn, createDashboardPaginationURL } from '@/lib/utils';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { itemsPerPageItems } from '@/lib/data';
 
function Paginator({
  pages,
  itemsPerPage,
  currentPage,
  prevPage,
  nextPage,
  currentQuery,
}: {
  pages: number;
  itemsPerPage: number
  currentPage: number;
  prevPage: number | null;
  nextPage: number | null;
  currentQuery: string;
}) {

  const router = useRouter();

  const onChangeItemsPerPage = useCallback((value: string) => {
    router.push(createDashboardPaginationURL({ n: parseInt(value), p: currentPage, q: currentQuery }));
  }, [currentQuery, currentPage, router]);

  const { currentPageLink, firstPageLink, lastPageLink, prevPageLink, nextPageLink } = useMemo(() => ({
    currentPageLink: createDashboardPaginationURL({ n: itemsPerPage, p: currentPage, q: currentQuery }),
    firstPageLink: createDashboardPaginationURL({ n: itemsPerPage, p: 1, q: currentQuery }),
    lastPageLink: createDashboardPaginationURL({ n: itemsPerPage, p: pages, q: currentQuery }),
    prevPageLink: prevPage ? createDashboardPaginationURL({ n: itemsPerPage, p: prevPage, q: currentQuery }) : undefined,
    nextPageLink: nextPage ? createDashboardPaginationURL({ n: itemsPerPage, p: nextPage, q: currentQuery }): undefined,
  }), [currentPage, nextPage, pages, prevPage, currentQuery, itemsPerPage]);

  return (
    <div className='w-full flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Label>Items</Label>
        <EasySelect
          className='w-20'
          value={itemsPerPage.toString()}
          onValueChange={onChangeItemsPerPage}
          items={itemsPerPageItems} 
        />
      </div>
      <Pagination className='w-auto m-0'>
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
    </div>
  );
}

export default Paginator;