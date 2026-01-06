function GetPaginationPages(
  currentPage: number,
  totalPages: number,
  siblingCount = 2
) {
  const pages: (number | "...")[] = [];

  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

  pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}
export default GetPaginationPages;