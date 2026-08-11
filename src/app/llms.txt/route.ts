import { siteConfig } from "@/config/site.config";
import { getAllAttorneys, getAllPracticeAreas } from "@/lib/data";
import { getAllInsights, getAllJobPosts, isJobOpen } from "@/lib/content";

// Insights and careers now live in Sanity and can change between deploys,
// so this can no longer be force-static - revalidate periodically instead.
export const revalidate = 3600;

/**
 * Serves /llms.txt - an emerging (not yet formally standardized) convention
 * for giving AI systems a concise, curated summary of a site in plain
 * markdown, similar in spirit to robots.txt or sitemap.xml. Not every
 * crawler looks for it, and it's not a ranking mechanism - it's a
 * lightweight, honest description of what's actually on the site, built
 * from the same data sources as the pages themselves so it can never claim
 * something the site doesn't actually contain.
 */
export async function GET() {
  const attorneys = getAllAttorneys();
  const practiceAreas = getAllPracticeAreas();
  const [allInsights, allJobs] = await Promise.all([getAllInsights(), getAllJobPosts()]);
  const insights = allInsights.slice(0, 8);
  const openRoles = allJobs.filter(isJobOpen);

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.name} is a boutique law firm founded in ${siteConfig.foundingDate}, based in ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion}. A partner leads every engagement across ${practiceAreas.length} practice areas.`,
    "",
    "## Practice areas",
    ...practiceAreas.map((p) => `- [${p.title}](${siteConfig.url}/practice-areas/${p.slug}): ${p.copy}`),
    "",
    "## Attorneys",
    ...attorneys.map((a) => `- [${a.name}](${siteConfig.url}/attorneys/${a.slug}): ${a.title} — ${a.intro}`),
    "",
    "## Key pages",
    `- [About](${siteConfig.url}/about)`,
    `- [Case studies](${siteConfig.url}/case-studies)`,
    `- [Contact](${siteConfig.url}/contact)`,
  ];

  if (insights.length > 0) {
    lines.push(
      "",
      "## Articles (recent writing)",
      ...insights.map((i) => `- [${i.title}](${siteConfig.url}/insights/${i.slug}): ${i.excerpt}`),
    );
  }

  if (openRoles.length > 0) {
    lines.push(
      "",
      "## Open roles",
      ...openRoles.map((j) => `- [${j.title}](${siteConfig.url}/careers/${j.slug}): ${j.location}, ${j.type}`),
    );
  }

  lines.push(
    "",
    "## Contact",
    `- Address: ${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion} ${siteConfig.address.postalCode}`,
    `- Phone: ${siteConfig.consultationPhoneDisplay}`,
    `- Email: ${siteConfig.email}`,
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
