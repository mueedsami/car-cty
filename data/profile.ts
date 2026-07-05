export type Project = {
  slug: string;
  title: string;
  district: string;
  role: string;
  stack: string[];
  problem: string;
  solution: string;
  impact: string[];
  color: string;
};

export type Checkpoint = {
  id: string;
  title: string;
  district: string;
  x: number;
  y: number;
  radius: number;
  icon: string;
  summary: string;
  bullets: string[];
  metrics?: string[];
  projectSlug?: string;
  vibe: "origin" | "madestic" | "accessibility" | "unilever" | "leadership" | "future";
};

export const profile = {
  name: "Mueed Ibne Sami",
  headline: "CSE undergrad, operator, builder, and systems thinker.",
  tagline: "I build workflows, products, and experiences that make life easier and smoother.",
  roles: [
    "Co-Founder & COO, mADestic Digital",
    "BizLearner, Unilever Bangladesh",
    "CSE Undergraduate, IUT",
    "Blind-first HCI and accessibility builder",
    "Project manager for ERP and automation systems"
  ],
  contact: {
    email: "mueedibnesami.anoy@gmail.com",
    location: "Dhaka, Bangladesh"
  }
};

export const projects: Project[] = [
  {
    slug: "errum-erp",
    title: "Errum ERP",
    district: "mADestic Downtown",
    role: "Product operations, architecture direction, QA thinking, workflow design",
    stack: ["Laravel", "Next.js", "MySQL", "POS", "Inventory", "Accounting"],
    problem: "Retail operations were split across stock, POS, social commerce orders, dispatch, returns, accounting, and reporting.",
    solution: "Built and iterated a full ERP flow with order assignment, barcode stock, inventory views, POS reports, cash sheet logic, return/exchange handling, and operational dashboards.",
    impact: [
      "Unified sales, stock, dispatch, returns, and accounting workflows.",
      "Reduced manual confusion around barcode availability and branch assignment.",
      "Created a base for future automation and business intelligence."
    ],
    color: "#f6f388"
  },
  {
    slug: "deshio-erp",
    title: "Deshio ERP",
    district: "mADestic Downtown",
    role: "System planner, product workflow owner, operations designer",
    stack: ["Laravel", "Next.js", "RBAC", "Inventory", "Sales", "Reports"],
    problem: "The business needed a custom ERP where online orders, branch assignments, reservations, stock movement, and reports followed exact operational rules.",
    solution: "Designed a full custom ERP module map covering catalog, inventory, sales, stores, customers, accounting, RBAC, and reporting.",
    impact: [
      "Moved from generic tools toward a brand-specific ERP backbone.",
      "Clarified order assignment and reservation policy.",
      "Created test workflows for edge cases like returns, stale reservations, and one-stock cases."
    ],
    color: "#7dd3fc"
  },
  {
    slug: "abcd-braille-trainer",
    title: "ABCD Braille Trainer",
    district: "Blind-First Innovation Zone",
    role: "HCI concept owner, accessibility workflow designer, product direction",
    stack: ["Next.js", "FastAPI", "Electron", "Arduino", "Gamepad", "Voice UX"],
    problem: "Blind learners need a keyboard-first, sound-first, low-friction way to learn English Braille interactively.",
    solution: "Designed a blind-first desktop trainer with Bangla voice guidance, gamepad control, custom keyboard support, and clear learning/practice/exam modes.",
    impact: [
      "Created an accessible training concept for Braille literacy.",
      "Introduced voice-guided interaction patterns for blind users.",
      "Prepared the base for custom hardware and classroom use."
    ],
    color: "#a7f3d0"
  },
  {
    slug: "ubl-digital-shelf",
    title: "UBL Digital Shelf Intelligence",
    district: "Unilever Supply Chain Lane",
    role: "BizLearner, reporting workflow owner, automation planner",
    stack: ["Python", "Excel automation", "Data parsing", "OLA", "CPP", "SKU mapping"],
    problem: "Daily marketplace reporting across Arogga, Daraz, Othoba, Pandamart, Shajgoj, Shwapno, and UShopBD needed consistency and less manual repair.",
    solution: "Built an MVP direction for daily ingestion, SKU mapping, stock decision, OLA/NOLA generation, CPP checking, and account-wise source parsing.",
    impact: [
      "Turned fragmented reports into a cleaner workflow.",
      "Reduced manual dependency in price and availability checks.",
      "Created a repeatable foundation for digital shelf intelligence."
    ],
    color: "#34d399"
  },
  {
    slug: "positive-one",
    title: "The Positive One",
    district: "Leadership Square",
    role: "Co-founder, community builder, content and operations lead",
    stack: ["Community", "Content", "Publishing", "Web operations"],
    problem: "Positive youth-centered storytelling needed a recognizable digital platform and community presence.",
    solution: "Helped build and operate a youth-led portal with publishing workflows, brand presence, and social reach.",
    impact: [
      "Grew a platform with strong social presence.",
      "Built digital operations around content and community.",
      "Created a foundation for positive storytelling and youth engagement."
    ],
    color: "#fda4af"
  }
];

export const checkpoints: Checkpoint[] = [
  {
    id: "origin-gate",
    title: "Origin Gate",
    district: "Start of the City",
    x: 1120,
    y: 7820,
    radius: 130,
    icon: "✦",
    summary: "The city begins with the identity: builder, operator, learner, and problem solver.",
    bullets: [
      "CSE undergraduate at Islamic University of Technology.",
      "Comfortable moving between code, operations, product, and people.",
      "Core belief: systems should reduce chaos and make work smoother."
    ],
    metrics: ["CSE", "Systems", "Operations"],
    vibe: "origin"
  },
  {
    id: "madestic-downtown",
    title: "mADestic Downtown",
    district: "ERP and Product District",
    x: 5580,
    y: 6260,
    radius: 145,
    icon: "▣",
    summary: "The high-rise district for products, ERPs, workflows, dashboards, and real business messes turned into systems.",
    bullets: [
      "Co-Founder & COO at mADestic Digital.",
      "Worked across Errum ERP, Deshio ERP, SarengMed, and web systems.",
      "Focus: operational clarity, automation, QA, and business-ready software."
    ],
    metrics: ["ERP", "POS", "Inventory", "Automation"],
    projectSlug: "errum-erp",
    vibe: "madestic"
  },
  {
    id: "accessibility-zone",
    title: "Blind-First Innovation Zone",
    district: "Accessibility District",
    x: 8420,
    y: 5520,
    radius: 150,
    icon: "⠿",
    summary: "A quieter zone built around Braille, sound, hardware, and HCI for blind users.",
    bullets: [
      "ABCD Braille Trainer with voice-first interaction.",
      "Srobon blind-first PDF reader concept.",
      "Okkhi research lab direction for blind computer interaction."
    ],
    metrics: ["HCI", "Braille", "Voice UX", "Hardware"],
    projectSlug: "abcd-braille-trainer",
    vibe: "accessibility"
  },
  {
    id: "unilever-lane",
    title: "Unilever Supply Chain Lane",
    district: "Business Intelligence District",
    x: 12420,
    y: 4040,
    radius: 145,
    icon: "◈",
    summary: "The clean corporate lane for FMCG reporting, stock visibility, price checking, and digital shelf intelligence.",
    bullets: [
      "BizLearner at Unilever Bangladesh.",
      "Worked on SKU-level reporting logic and marketplace availability analysis.",
      "Built thinking around OLA, CPP, mapping, ingestion, and reporting automation."
    ],
    metrics: ["FMCG", "OLA", "CPP", "SKU Intelligence"],
    projectSlug: "ubl-digital-shelf",
    vibe: "unilever"
  },
  {
    id: "leadership-square",
    title: "Leadership Square",
    district: "People and Projects Plaza",
    x: 14280,
    y: 3420,
    radius: 145,
    icon: "✺",
    summary: "The open plaza for teams, clubs, youth projects, community work, and leading from the front.",
    bullets: [
      "General Secretary at ROFS and Project Director at Project RBC.",
      "Experience coordinating people, projects, events, and communication.",
      "Leadership style: turn ambiguity into momentum."
    ],
    metrics: ["Leadership", "Teams", "Execution"],
    projectSlug: "positive-one",
    vibe: "leadership"
  },
  {
    id: "future-highway",
    title: "Future Highway",
    district: "Next Chapter",
    x: 17120,
    y: 2000,
    radius: 150,
    icon: "∞",
    summary: "The long glowing road ahead: agentic AI, accessibility, HCI, Japan research, and systems that feel alive.",
    bullets: [
      "Build agentic systems that can operate workflows, not just answer questions.",
      "Push deeper into HCI and blind-first technology.",
      "Keep combining software, operations, research, and human impact."
    ],
    metrics: ["Agentic AI", "HCI", "Japan", "Accessibility"],
    vibe: "future"
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
