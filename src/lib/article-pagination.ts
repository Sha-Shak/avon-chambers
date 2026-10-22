export const ARTICLE_PAGE_SIZE = 9;

export function articlePagePath(page: number) {
  return page <= 1 ? "/insights" : `/insights/page/${page}`;
}

export function articlePageCount(count: number) {
  return Math.max(1, Math.ceil(count / ARTICLE_PAGE_SIZE));
}
