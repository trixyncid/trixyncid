export type ProjectCategory = "software" | "enterprise" | "web";

export type ProjectItem = {
  id: string;
  category: ProjectCategory;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string | null;
  featured?: boolean;
};

export const projects: ProjectItem[] = [
  {
    id: "kms-connect",
    category: "software",
    image: "/projects/kms.png",
    tags: ["Django", "Flutter", "Mobile Apps"],
    liveUrl: "https://kms-connect.com/download",
    featured: true,
  },
  {
    id: "malavari-films",
    category: "software",
    image: "/projects/malavari-films.png",
    tags: ["Next.js", "Django", "Video Streaming", "Payments"],
    liveUrl: "https://malavarifilms.com",
    featured: true,
  },
  {
    id: "gerindra-sumut",
    category: "enterprise",
    image: "/projects/gerindra.png",
    tags: ["Django", "Docker", "OCR"],
    featured: true,
  },
  {
    id: "yanks-brits",
    category: "enterprise",
    image: "/projects/ynb.png",
    tags: ["Django", "Scheduling", "Payroll"],
    featured: false,
  },
  {
    id: "goholiday-dc",
    category: "software",
    image: "/projects/goholiday.png",
    tags: ["Next.js", "Marketplace", "Django"],
    liveUrl: "https://dc.goholiday.id",
    featured: true,
  },
  {
    id: "pgi-tower",
    category: "web",
    image: "/projects/pgi.png",
    tags: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://www.pgitower.co.id/en",
    featured: true,
  },
  {
    id: "sejahtera-bersama-erp",
    category: "enterprise",
    image: "/projects/ims.png",
    tags: ["Django", "ERP", "POS", "Inventory"],
    featured: true,
  },
  {
    id: "mitra-laju-interocean",
    category: "enterprise",
    image: "/projects/mli.png",
    tags: ["Next.js", "Elysia", "PostgreSQL", "Logistics"],
    featured: true,
  },
  {
    id: "itnb-portal",
    category: "enterprise",
    image: "/projects/itnb.png",
    tags: ["Django", "Portal", "Education"],
    featured: true,
  },
  {
    id: "chinergy-shenindo",
    category: "web",
    image: "/projects/chinergy.png",
    tags: ["Next.js", "Tailwind CSS", "i18n"],
    liveUrl: "https://www.chinergyshenindo.com/en",
    featured: false,
  },
  {
    id: "citikopi",
    category: "web",
    image: "/projects/citikopi.png",
    tags: ["Next.js", "Tailwind CSS", "i18n"],
    liveUrl: "https://www.citikopi.id/en",
    featured: false,
  },
  {
    id: "genba-solusindo",
    category: "web",
    image: "/projects/gis.png",
    tags: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://www.genbasolusindo.co.id",
    featured: false,
  },
  {
    id: "skyview-setiabudi",
    category: "web",
    image: "/projects/skyview.png",
    tags: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://www.skyview.co.id",
    featured: false,
  },
];

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export const projectIds = projects.map((p) => p.id);
