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
    id: "sejahtera-bersama-erp",
    category: "enterprise",
    image: "/projects/ims.jpg",
    tags: ["Django", "ERP", "POS", "Inventory"],
    featured: true,
  },
  {
    id: "mitra-laju-interocean",
    category: "enterprise",
    image: "/projects/mli.jpg",
    tags: ["Next.js", "Elysia", "PostgreSQL", "Logistics"],
    featured: true,
  },
  {
    id: "malavari-films",
    category: "software",
    image: "/projects/malavari-films.jpg",
    tags: ["Next.js", "Django", "Video Streaming", "Payments"],
    liveUrl: "https://malavarifilms.com",
    featured: true,
  },
  {
    id: "kms-connect",
    category: "software",
    image: "/projects/kms.jpg",
    tags: ["Django", "Flutter", "Mobile Apps"],
    liveUrl: "https://kms-connect.com/download",
    featured: true,
  },
  {
    id: "goholiday-dc",
    category: "software",
    image: "/projects/goholiday.jpg",
    tags: ["Next.js", "Marketplace", "Django"],
    liveUrl: "https://dc.goholiday.id",
    featured: true,
  },
  {
    id: "pgi-tower",
    category: "web",
    image: "/projects/pgi.jpg",
    tags: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://www.pgitower.co.id/en",
    featured: true,
  },
  {
    id: "itnb-portal",
    category: "enterprise",
    image: "/projects/itnb.jpg",
    tags: ["Django", "Portal", "Education"],
    featured: false,
  },
  {
    id: "yanks-brits",
    category: "enterprise",
    image: "/projects/ynb.jpg",
    tags: ["Django", "Scheduling", "Payroll"],
    featured: false,
  },
  {
    id: "chinergy-shenindo",
    category: "web",
    image: "/projects/chinergy.jpg",
    tags: ["Next.js", "Tailwind CSS", "i18n"],
    liveUrl: "https://www.chinergyshenindo.com/en",
    featured: false,
  },
  {
    id: "citikopi",
    category: "web",
    image: "/projects/citikopi.jpg",
    tags: ["Next.js", "Tailwind CSS", "i18n"],
    liveUrl: "https://www.citikopi.id/en",
    featured: false,
  },
  {
    id: "genba-solusindo",
    category: "web",
    image: "/projects/gis.jpg",
    tags: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://www.genbasolusindo.co.id",
    featured: false,
  },
  {
    id: "skyview-setiabudi",
    category: "web",
    image: "/projects/skyview.jpg",
    tags: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://www.skyview.co.id",
    featured: false,
  },
  {
    id: "gerindra-sumut",
    category: "enterprise",
    image: "/projects/gerindra.jpg",
    tags: ["Django", "Docker", "OCR"],
    featured: false,
  },
];

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export const projectIds = projects.map((p) => p.id);
