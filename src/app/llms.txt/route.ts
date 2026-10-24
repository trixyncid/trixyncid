import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { faqIds } from "@/content/faq";
import { factKeys } from "@/content/facts";

export const dynamic = "force-static";

/**
 * llms.txt (https://llmstxt.org): a plain-text brief for AI assistants and
 * answer engines, built from the same content and English copy as the site.
 */
export async function GET() {
  const locale = "en";
  const tMeta = await getTranslations({ locale, namespace: "metadata.home" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tServices = await getTranslations({ locale, namespace: "services.items" });
  const tProjects = await getTranslations({ locale, namespace: "projects.items" });
  const tFaq = await getTranslations({ locale, namespace: "faq.items" });
  const tFacts = await getTranslations({ locale, namespace: "metadata.facts" });
  const base = `${siteConfig.url}/${locale}`;

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${tMeta("description")}`,
    "",
    tFooter("description"),
    "",
    `- Based in: ${siteConfig.address.city}, ${siteConfig.address.region}, ${siteConfig.address.country}`,
    "- Works with: businesses in Medan and North Sumatra on-site, and across Indonesia remotely",
    "- Languages: English, Bahasa Indonesia, Chinese (Simplified)",
    `- Contact: ${siteConfig.email} · WhatsApp ${siteConfig.telephone}`,
    `- Website: ${siteConfig.url} (also in Indonesian at ${siteConfig.url}/id and Chinese at ${siteConfig.url}/zh)`,
    "",
    "## Key facts",
    "",
    ...factKeys.map(
      (key) => `- ${tFacts(`${key}.value`, { count: projects.length })}: ${tFacts(`${key}.label`)}`,
    ),
    "",
    "## Services",
    "",
    ...services.map(
      (service) => `- [${tServices(`${service.id}.title`)}](${base}/services): ${tServices(`${service.id}.build`)}`,
    ),
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        `- [${tProjects(`${project.id}.title`)}](${base}/projects/${project.id}) (${tProjects(`${project.id}.client`)}): ${tProjects(`${project.id}.description`)}`,
    ),
    "",
    "## FAQ",
    "",
    ...faqIds.flatMap((id) => [`### ${tFaq(`${id}.question`)}`, "", tFaq(`${id}.answer`), ""]),
    "## Pages",
    "",
    `- [About](${base}/about)`,
    `- [Services](${base}/services)`,
    `- [Projects](${base}/projects)`,
    `- [FAQ](${base}/faq)`,
    `- [Contact](${base}/contact)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
