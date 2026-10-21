/** Normalize public page paths only; never change case-sensitive assets, APIs or Studio URLs. */
export function normalizedPublicPath(pathname: string): string {
  const lower = pathname.toLowerCase();
  const roots = ["about", "contact", "practice-areas", "lawyers", "insights", "news-events", "case-studies", "careers", "pro-bono", "life-at-avon", "policies", "bn", "terms-of-engagement", "privacy-policy", "lawyer-advertising", "accessibility"];
  if (!roots.includes(lower.split("/")[1]) || pathname.includes(".")) return pathname;
  return lower;
}
