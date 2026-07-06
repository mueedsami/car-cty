"use client";

import { useEffect, useRef, useState } from "react";
import { Checkpoint, checkpoints, getProject, profile } from "@/data/profile";

type Car = {
  x: number;
  y: number;
  angle: number;
  speed: number;
};

type Keys = Record<string, boolean>;
type Point = { x: number; y: number };

type RoadPath = {
  label: string;
  points: Point[];
  width: number;
  kind: "express" | "boulevard" | "avenue" | "garden" | "harbor";
};

type Building = {
  x: number;
  y: number;
  w: number;
  h: number;
  floors: number;
  color: string;
  side: string;
  roof: string;
  accent: string;
  label?: string;
  landmark?: boolean;
  tier?: number;
};

type StoryPanel = {
  checkpointId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  align?: "left" | "right";
};

type ParkingZone = {
  id: string;
  kind: "project" | "puzzle";
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
  color: string;
  checkpointId?: string;
  projectSlug?: string;
  detail?: {
    subtitle: string;
    description: string;
    bullets: string[];
    tags: string[];
  };
  puzzle?: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
};

type Park = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
};

type District = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
};

const WORLD = { width: 18000, height: 9200 };
const START: Car = { x: 690, y: 7820, angle: 0, speed: 0 };

const mainBoulevard: Point[] = [
  { x: 520, y: 7820 },
  { x: 1640, y: 7820 },
  { x: 2860, y: 7410 },
  { x: 4200, y: 6680 },
  { x: 5560, y: 6260 },
  { x: 6920, y: 6040 },
  { x: 8180, y: 5520 },
  { x: 9580, y: 5020 },
  { x: 11040, y: 4520 },
  { x: 12520, y: 4040 },
  { x: 14020, y: 3420 },
  { x: 15650, y: 2600 },
  { x: 17450, y: 1940 },
];

const roadPaths: RoadPath[] = [
  {
    label: "Aurelia Grand Boulevard",
    width: 310,
    kind: "express",
    points: mainBoulevard,
  },
  {
    label: "Origin Crescent",
    width: 180,
    kind: "garden",
    points: [
      { x: 1040, y: 7820 },
      { x: 1110, y: 7150 },
      { x: 1730, y: 6730 },
      { x: 2580, y: 6810 },
      { x: 3060, y: 7320 },
    ],
  },
  {
    label: "Founder Skyline Loop",
    width: 185,
    kind: "boulevard",
    points: [
      { x: 4480, y: 6600 },
      { x: 4710, y: 5700 },
      { x: 5700, y: 5200 },
      { x: 6810, y: 5480 },
      { x: 7040, y: 6040 },
    ],
  },
  {
    label: "Research Garden Road",
    width: 178,
    kind: "garden",
    points: [
      { x: 7300, y: 5960 },
      { x: 7650, y: 6780 },
      { x: 9080, y: 6900 },
      { x: 9860, y: 6040 },
      { x: 9560, y: 5020 },
    ],
  },
  {
    label: "Digital Shelf Avenue",
    width: 190,
    kind: "boulevard",
    points: [
      { x: 10950, y: 4520 },
      { x: 11250, y: 3600 },
      { x: 12300, y: 3200 },
      { x: 13420, y: 3420 },
      { x: 14020, y: 3420 },
    ],
  },
  {
    label: "Leadership Promenade",
    width: 182,
    kind: "garden",
    points: [
      { x: 13470, y: 3600 },
      { x: 13960, y: 4380 },
      { x: 15100, y: 4280 },
      { x: 15720, y: 3360 },
      { x: 15650, y: 2600 },
    ],
  },
  {
    label: "Future Harbor Drive",
    width: 188,
    kind: "harbor",
    points: [
      { x: 15650, y: 2600 },
      { x: 16020, y: 3640 },
      { x: 17300, y: 3840 },
      { x: 17920, y: 2940 },
      { x: 17450, y: 1940 },
    ],
  },
];

const districts: District[] = [
  {
    x: 430,
    y: 6370,
    w: 2350,
    h: 880,
    label: "Origin Campus",
    color: "#f6f388",
  },
  {
    x: 4280,
    y: 5030,
    w: 2800,
    h: 940,
    label: "mADestic Financial District",
    color: "#7dd3fc",
  },
  {
    x: 7480,
    y: 5850,
    w: 2380,
    h: 1020,
    label: "Blind-First Research Gardens",
    color: "#a7f3d0",
  },
  {
    x: 11120,
    y: 3090,
    w: 2540,
    h: 860,
    label: "Business Intelligence Quarter",
    color: "#34d399",
  },
  {
    x: 13520,
    y: 4180,
    w: 2300,
    h: 870,
    label: "Leadership Civic Plaza",
    color: "#fda4af",
  },
  {
    x: 15840,
    y: 1050,
    w: 1890,
    h: 900,
    label: "Future Harbor",
    color: "#c4b5fd",
  },
];

const parks: Park[] = [
  { x: 520, y: 6940, w: 1380, h: 600, label: "Origin Park", color: "#f6f388" },
  {
    x: 3920,
    y: 5900,
    w: 1260,
    h: 560,
    label: "Founder Garden",
    color: "#7dd3fc",
  },
  {
    x: 7580,
    y: 6160,
    w: 1640,
    h: 620,
    label: "Braille Grove",
    color: "#a7f3d0",
  },
  {
    x: 11170,
    y: 3640,
    w: 1480,
    h: 520,
    label: "Digital Shelf Green",
    color: "#34d399",
  },
  {
    x: 13600,
    y: 4460,
    w: 1620,
    h: 560,
    label: "Project Plaza",
    color: "#fda4af",
  },
  {
    x: 16160,
    y: 1220,
    w: 1280,
    h: 520,
    label: "Outlook Deck",
    color: "#c4b5fd",
  },
];

const storyPanels: StoryPanel[] = [
  {
    checkpointId: "origin-gate",
    x: 820,
    y: 7120,
    w: 1320,
    h: 440,
    color: "#f6f388",
  },
  {
    checkpointId: "madestic-downtown",
    x: 5000,
    y: 5480,
    w: 1560,
    h: 460,
    color: "#7dd3fc",
  },
  {
    checkpointId: "accessibility-zone",
    x: 8060,
    y: 6260,
    w: 1580,
    h: 460,
    color: "#a7f3d0",
  },
  {
    checkpointId: "unilever-lane",
    x: 11360,
    y: 3300,
    w: 1600,
    h: 460,
    color: "#34d399",
  },
  {
    checkpointId: "leadership-square",
    x: 13800,
    y: 4450,
    w: 1600,
    h: 460,
    color: "#fda4af",
  },
  {
    checkpointId: "future-highway",
    x: 16020,
    y: 1300,
    w: 1600,
    h: 460,
    color: "#c4b5fd",
  },
];

const parkingZones: ParkingZone[] = [
  {
    id: "iut-parking",
    kind: "project",
    title: "IUT Parking",
    x: 815,
    y: 6830,
    w: 360,
    h: 150,
    angle: -0.08,
    color: "#f6f388",
    checkpointId: "origin-gate",
    detail: {
      subtitle: "Education foundation",
      description:
        "The starting building of the city: CSE undergraduate life at Islamic University of Technology, where the engineering mindset begins.",
      bullets: [
        "Formal CSE base for algorithms, software systems, HCI, and project work.",
        "The place where technical curiosity started turning into real systems.",
        "Represents discipline, learning pressure, and problem-solving stamina.",
      ],
      tags: ["IUT", "CSE", "Foundation"],
    },
  },
  {
    id: "cse-parking",
    kind: "project",
    title: "CSE Building Parking",
    x: 1265,
    y: 6835,
    w: 370,
    h: 150,
    angle: 0.1,
    color: "#a7f3d0",
    checkpointId: "origin-gate",
    detail: {
      subtitle: "Computer science core",
      description:
        "This building represents the technical backbone: data structures, algorithms, software engineering, HCI, compiler ideas, AI, and systems thinking.",
      bullets: [
        "Turns vague ideas into implementation plans.",
        "Supports both academic understanding and real product execution.",
        "Connects coding with human-centered system design.",
      ],
      tags: ["Algorithms", "HCI", "Systems"],
    },
  },
  {
    id: "systems-parking",
    kind: "project",
    title: "Systems Thinking Parking",
    x: 1710,
    y: 6875,
    w: 370,
    h: 150,
    angle: 0.18,
    color: "#7dd3fc",
    checkpointId: "origin-gate",
    detail: {
      subtitle: "From code to workflows",
      description:
        "A life theme building: seeing messy operations as systems that can be mapped, simplified, tested, automated, and improved.",
      bullets: [
        "Breaks chaos into rules, states, exceptions, and decisions.",
        "Useful in ERP, reporting, accessibility tools, and leadership work.",
        "Represents the habit of asking: where exactly does the process break?",
      ],
      tags: ["Workflow", "Logic", "Operations"],
    },
  },
  {
    id: "ops-origin-parking",
    kind: "project",
    title: "Operations Mindset Parking",
    x: 2280,
    y: 6905,
    w: 370,
    h: 150,
    angle: 0.26,
    color: "#f6f388",
    checkpointId: "origin-gate",
    detail: {
      subtitle: "Builder + operator identity",
      description:
        "This building is about not only building software, but understanding how people actually use it under pressure.",
      bullets: [
        "Balances product, people, business rules, edge cases, and execution.",
        "Explains why your portfolio city is not just pretty: it is operational storytelling.",
        "The origin of your COO/product-ops mindset.",
      ],
      tags: ["COO", "Product Ops", "Execution"],
    },
  },

  {
    id: "ops-madestic-parking",
    kind: "project",
    title: "mADestic Ops Parking",
    x: 4340,
    y: 5520,
    w: 390,
    h: 150,
    angle: -0.42,
    color: "#7dd3fc",
    checkpointId: "madestic-downtown",
    detail: {
      subtitle: "Operational command center",
      description:
        "The building for planning, QA thinking, rollout pressure, client asks, repeated fixes, and making software survive real business use.",
      bullets: [
        "Converts client chaos into modules, flows, and priorities.",
        "Connects developers, business users, testers, and deployment realities.",
        "Represents your practical product management muscle.",
      ],
      tags: ["Ops", "QA", "Delivery"],
    },
  },
  {
    id: "errum-building-parking",
    kind: "project",
    title: "Errum ERP Parking",
    x: 4840,
    y: 5550,
    w: 410,
    h: 155,
    angle: -0.28,
    color: "#67e8f9",
    checkpointId: "madestic-downtown",
    projectSlug: "errum-erp",
    detail: {
      subtitle: "Retail ERP product system",
      description:
        "A major ERP building covering retail stock, POS, orders, barcode logic, returns, cash sheets, reports, and operational edge cases.",
      bullets: [
        "Order, stock, dispatch, return/exchange, POS, and cash-sheet workflows.",
        "Heavy edge-case thinking around barcode availability and reporting accuracy.",
        "A real business system, not just a portfolio demo.",
      ],
      tags: ["ERP", "POS", "Inventory"],
    },
  },
  {
    id: "deshio-building-parking",
    kind: "project",
    title: "Deshio ERP Parking",
    x: 5310,
    y: 5585,
    w: 410,
    h: 155,
    angle: -0.16,
    color: "#f6f388",
    checkpointId: "madestic-downtown",
    projectSlug: "deshio-erp",
    detail: {
      subtitle: "Brand-specific ERP backbone",
      description:
        "A custom ERP direction for catalog, inventory, sales, store assignment, reservations, customers, accounting, and reports.",
      bullets: [
        "Manual online-order assignment rules and reservation timing.",
        "Store, stock, customer, accounting, and report module planning.",
        "Built around exact operational policies rather than generic software assumptions.",
      ],
      tags: ["ERP", "Stores", "Reports"],
    },
  },
  {
    id: "madestic-building-parking",
    kind: "project",
    title: "mADestic Digital Parking",
    x: 5790,
    y: 5685,
    w: 410,
    h: 155,
    angle: -0.06,
    color: "#ffb8d1",
    checkpointId: "madestic-downtown",
    detail: {
      subtitle: "Founder district tower",
      description:
        "This building represents mADestic Digital itself: the place where projects, clients, systems, creative thinking, and operations meet.",
      bullets: [
        "Co-Founder & COO identity lives here.",
        "Combines software delivery, product direction, client understanding, and team execution.",
        "The central business tower of the portfolio city.",
      ],
      tags: ["mADestic", "COO", "Agency"],
    },
  },
  {
    id: "sareng-building-parking",
    kind: "project",
    title: "SarengMed Parking",
    x: 6255,
    y: 5830,
    w: 390,
    h: 150,
    angle: 0.08,
    color: "#a7f3d0",
    checkpointId: "madestic-downtown",
    detail: {
      subtitle: "Medical equipment web system",
      description:
        "A product/business building for Sareng Medical Equipment web presence, cold outreach, product positioning, and B2B communication.",
      bullets: [
        "Connects digital systems with healthcare equipment communication.",
        "Represents product storytelling beyond pure software modules.",
        "Includes structured outreach and brand credibility thinking.",
      ],
      tags: ["B2B", "Medical", "Web"],
    },
  },
  {
    id: "web-building-parking",
    kind: "project",
    title: "Web Systems Parking",
    x: 6750,
    y: 5945,
    w: 380,
    h: 145,
    angle: 0.16,
    color: "#c4b5fd",
    checkpointId: "madestic-downtown",
    detail: {
      subtitle: "Web experiences and platforms",
      description:
        "A building for websites, portfolios, publishing platforms, landing pages, dashboards, and the craft of presenting ideas beautifully.",
      bullets: [
        "Represents projects where design, content, and engineering meet.",
        "Supports mADestic client work and internal initiatives.",
        "This city portfolio itself belongs to this tower.",
      ],
      tags: ["Next.js", "Portfolio", "Platforms"],
    },
  },

  {
    id: "okkhi-building-parking",
    kind: "project",
    title: "Okkhi Lab Parking",
    x: 7660,
    y: 5890,
    w: 390,
    h: 150,
    angle: -0.2,
    color: "#a7f3d0",
    checkpointId: "accessibility-zone",
    detail: {
      subtitle: "Blind research lab direction",
      description:
        "Okkhi represents a future research lab for blind computer interaction, blind AI interaction, hardware, HCI, and accessibility curriculum.",
      bullets: [
        "Research-first thinking for blind users in Bangladesh.",
        "Connects field study, product experiments, and inclusive design.",
        "A long-term direction, not just a single app.",
      ],
      tags: ["Okkhi", "Research", "Accessibility"],
    },
  },
  {
    id: "abcd-building-parking",
    kind: "project",
    title: "ABCD Braille Trainer Parking",
    x: 8155,
    y: 5895,
    w: 420,
    h: 155,
    angle: -0.16,
    color: "#a7f3d0",
    checkpointId: "accessibility-zone",
    projectSlug: "abcd-braille-trainer",
    detail: {
      subtitle: "Blind-first Braille learning system",
      description:
        "A voice-guided Braille trainer with keyboard/gamepad/custom hardware thinking, built for screen-independent learning.",
      bullets: [
        "Bangla voice guidance, practice/exam modes, and clear dot feedback.",
        "Custom 8-key hardware and gamepad control direction.",
        "Designed around blind-first interaction, not visual-first accessibility afterthoughts.",
      ],
      tags: ["Braille", "Voice UX", "Hardware"],
    },
  },
  {
    id: "srobon-building-parking",
    kind: "project",
    title: "Srobon PDF Reader Parking",
    x: 8660,
    y: 5920,
    w: 400,
    h: 150,
    angle: -0.08,
    color: "#7dd3fc",
    checkpointId: "accessibility-zone",
    detail: {
      subtitle: "Blind-first document reading",
      description:
        "A concept for a PDF reader that turns documents into navigable chapters, chunks, audio controls, and blind-friendly revision flow.",
      bullets: [
        "Granular reading by chapter, page, chunk, and marker.",
        "Gamepad-style navigation and text-to-speech workflow.",
        "Designed for learning, not just passive reading.",
      ],
      tags: ["PDF", "TTS", "Blind UX"],
    },
  },
  {
    id: "hci-building-parking",
    kind: "project",
    title: "HCI Research Parking",
    x: 9150,
    y: 6025,
    w: 380,
    h: 145,
    angle: 0.02,
    color: "#c4b5fd",
    checkpointId: "accessibility-zone",
    detail: {
      subtitle: "Human-computer interaction focus",
      description:
        "This building stores the research side: interaction models, accessibility, usability, embodied controls, and systems designed around real human behavior.",
      bullets: [
        "Supports Japan research direction and accessibility product ideas.",
        "Connects theory with practical interface decisions.",
        "Asks: can the user understand and control the system under real conditions?",
      ],
      tags: ["HCI", "Usability", "Research"],
    },
  },
  {
    id: "voice-building-parking",
    kind: "project",
    title: "Voice UX Parking",
    x: 9580,
    y: 6155,
    w: 370,
    h: 145,
    angle: 0.1,
    color: "#a7f3d0",
    checkpointId: "accessibility-zone",
    detail: {
      subtitle: "Audio-first interaction",
      description:
        "A small but important building about voice prompts, sound feedback, low-vision interaction, and state clarity without depending on the screen.",
      bullets: [
        "Voice feedback must be short, predictable, and helpful.",
        "Audio state design matters for blind-first tools.",
        "Represents the sound layer behind ABCD, Srobon, and future assistants.",
      ],
      tags: ["Voice", "Audio", "State Feedback"],
    },
  },

  {
    id: "ubl-building-parking",
    kind: "project",
    title: "Unilever BizLearner Parking",
    x: 10920,
    y: 3550,
    w: 400,
    h: 150,
    angle: -0.24,
    color: "#34d399",
    checkpointId: "unilever-lane",
    detail: {
      subtitle: "Corporate learning lane",
      description:
        "This building represents your BizLearner experience at Unilever Bangladesh and exposure to FMCG operations, reporting, and business discipline.",
      bullets: [
        "Connects technical automation with business reporting needs.",
        "Shows you can operate inside a corporate environment.",
        "Adds supply-chain and commercial intelligence to your builder profile.",
      ],
      tags: ["Unilever", "FMCG", "BizLearner"],
    },
  },
  {
    id: "digital-shelf-building-parking",
    kind: "project",
    title: "Digital Shelf Intelligence Parking",
    x: 11440,
    y: 3610,
    w: 430,
    h: 155,
    angle: -0.2,
    color: "#34d399",
    checkpointId: "unilever-lane",
    projectSlug: "ubl-digital-shelf",
    detail: {
      subtitle: "Marketplace reporting engine",
      description:
        "A workflow for SKU mapping, daily account outputs, OLA/NOLA generation, CPP checks, availability logic, and report ingestion.",
      bullets: [
        "Works across Arogga, Daraz, Othoba, Pandamart, Shajgoj, Shwapno, and UShopBD.",
        "Turns messy Excel/source files into structured reporting intelligence.",
        "Represents automation applied to real supply-chain visibility problems.",
      ],
      tags: ["OLA", "CPP", "SKU Mapping"],
    },
  },
  {
    id: "reports-building-parking",
    kind: "project",
    title: "Reports Tower Parking",
    x: 12000,
    y: 3605,
    w: 400,
    h: 150,
    angle: -0.13,
    color: "#7dd3fc",
    checkpointId: "unilever-lane",
    detail: {
      subtitle: "Reporting discipline",
      description:
        "This tower is about clean outputs: readable sheets, consistent metrics, account-wise views, and reducing reporting mistakes.",
      bullets: [
        "Focuses on clarity, repeatability, and decision-ready reporting.",
        "Represents the difference between data dump and operational insight.",
        "Important for both FMCG reporting and ERP dashboards.",
      ],
      tags: ["Excel", "Dashboards", "Clarity"],
    },
  },
  {
    id: "sku-building-parking",
    kind: "project",
    title: "SKU Mapping Parking",
    x: 12535,
    y: 3595,
    w: 390,
    h: 150,
    angle: -0.08,
    color: "#f6f388",
    checkpointId: "unilever-lane",
    detail: {
      subtitle: "The mapping backbone",
      description:
        "This building represents the boring-but-critical truth: if SKU mapping is wrong, every price, stock, and availability decision becomes unreliable.",
      bullets: [
        "Product IDs, UBL codes, source names, and account schemas must line up.",
        "Mapping quality decides OLA and CPP quality.",
        "A strong example of hidden operational complexity.",
      ],
      tags: ["SKU", "Product ID", "Data Quality"],
    },
  },
  {
    id: "ola-building-parking",
    kind: "project",
    title: "OLA/Availability Parking",
    x: 13010,
    y: 3630,
    w: 390,
    h: 150,
    angle: -0.04,
    color: "#34d399",
    checkpointId: "unilever-lane",
    detail: {
      subtitle: "On-shelf availability logic",
      description:
        "This building is about availability decisions, short stock identification, gift-bundle rules, daily availability matrices, and account-level OLA views.",
      bullets: [
        "Converts stock/scraper outputs into availability decisions.",
        "Handles exceptions like gift SKU or mother SKU availability.",
        "Represents business logic layered on top of raw marketplace data.",
      ],
      tags: ["OLA", "Availability", "Stock"],
    },
  },

  {
    id: "rofs-building-parking",
    kind: "project",
    title: "ROFS Parking",
    x: 13520,
    y: 4485,
    w: 390,
    h: 150,
    angle: -0.05,
    color: "#fda4af",
    checkpointId: "leadership-square",
    detail: {
      subtitle: "Club leadership",
      description:
        "This building represents General Secretary-level leadership, coordination, communication, and keeping people aligned around events and work.",
      bullets: [
        "Leadership beyond code: people, communication, timing, and responsibility.",
        "Builds confidence in leading teams and handling ambiguity.",
        "Adds community execution to your systems profile.",
      ],
      tags: ["ROFS", "Leadership", "Coordination"],
    },
  },
  {
    id: "rbc-building-parking",
    kind: "project",
    title: "Project RBC Parking",
    x: 14040,
    y: 4490,
    w: 400,
    h: 155,
    angle: 0.0,
    color: "#fda4af",
    checkpointId: "leadership-square",
    detail: {
      subtitle: "Project direction",
      description:
        "A leadership tower for Project RBC: planning, people, momentum, and converting a broad mission into executable actions.",
      bullets: [
        "Represents project direction under real-world uncertainty.",
        "Combines vision, delegation, follow-up, and stakeholder communication.",
        "Shows that your work includes human systems, not only software systems.",
      ],
      tags: ["RBC", "Project Director", "Execution"],
    },
  },
  {
    id: "positive-one-building-parking",
    kind: "project",
    title: "The Positive One Parking",
    x: 14605,
    y: 4505,
    w: 420,
    h: 155,
    angle: 0.04,
    color: "#f6f388",
    checkpointId: "leadership-square",
    projectSlug: "positive-one",
    detail: {
      subtitle: "Youth-led positive media platform",
      description:
        "The Positive One building represents publishing, community, social reach, youth storytelling, and digital operations around a positive mission.",
      bullets: [
        "Content, platform, brand, and community operations.",
        "A social-impact side of your portfolio city.",
        "Shows your ability to build beyond technical systems.",
      ],
      tags: ["Community", "Media", "Publishing"],
    },
  },
  {
    id: "teams-building-parking",
    kind: "project",
    title: "Teams Parking",
    x: 15100,
    y: 4560,
    w: 380,
    h: 150,
    angle: 0.1,
    color: "#c4b5fd",
    checkpointId: "leadership-square",
    detail: {
      subtitle: "People systems",
      description:
        "This building is about working with people: assigning work, following up, resolving confusion, keeping energy alive, and aligning outcomes.",
      bullets: [
        "Leadership means designing communication loops, not just giving instructions.",
        "Useful across mADestic, ROFS, RBC, and client projects.",
        "Represents the human side of operational excellence.",
      ],
      tags: ["Teams", "Communication", "Momentum"],
    },
  },

  {
    id: "agents-building-parking",
    kind: "project",
    title: "Agentic AI Parking",
    x: 15720,
    y: 1760,
    w: 400,
    h: 150,
    angle: -0.18,
    color: "#c4b5fd",
    checkpointId: "future-highway",
    detail: {
      subtitle: "Autonomous workflow systems",
      description:
        "This future tower is about AI agents that do real work: monitor, decide, trigger actions, summarize, and help operate complex workflows.",
      bullets: [
        "Moves beyond chatbots into workflow execution.",
        "Connects strongly with ERP automation and reporting intelligence.",
        "A future direction for hackathons, products, and business tools.",
      ],
      tags: ["Agentic AI", "Automation", "Workflows"],
    },
  },
  {
    id: "hci-lab-building-parking",
    kind: "project",
    title: "HCI Lab Parking",
    x: 16280,
    y: 1770,
    w: 420,
    h: 155,
    angle: -0.1,
    color: "#67e8f9",
    checkpointId: "future-highway",
    detail: {
      subtitle: "Research and graduate direction",
      description:
        "A future-facing building for HCI, human-robot/AI interaction, usability, accessibility, and Japan research possibilities.",
      bullets: [
        "Connects portfolio work with research identity.",
        "Frames accessibility and AI through human-centered design.",
        "Represents the next academic/professional chapter.",
      ],
      tags: ["HCI", "Research", "Japan"],
    },
  },
  {
    id: "japan-building-parking",
    kind: "project",
    title: "Japan / MEXT Parking",
    x: 16840,
    y: 1760,
    w: 400,
    h: 150,
    angle: -0.04,
    color: "#c4b5fd",
    checkpointId: "future-highway",
    detail: {
      subtitle: "Study and research pathway",
      description:
        "This tower represents the Japan direction: graduate research, HCI labs, application positioning, and building a profile that feels coherent.",
      bullets: [
        "Maps your work into research themes, not just project lists.",
        "Focuses on HCI, accessibility, AI interaction, and systems.",
        "A destination road for the next version of your life city.",
      ],
      tags: ["MEXT", "Japan", "Research"],
    },
  },
  {
    id: "impact-building-parking",
    kind: "project",
    title: "Impact Tower Parking",
    x: 17380,
    y: 1785,
    w: 390,
    h: 150,
    angle: 0.02,
    color: "#a7f3d0",
    checkpointId: "future-highway",
    detail: {
      subtitle: "Why the city exists",
      description:
        "This final building says the real point: build systems that reduce friction, help people work better, and make technology more human.",
      bullets: [
        "The bridge between business automation and accessibility impact.",
        "Keeps the portfolio from becoming only visuals or buzzwords.",
        "Ends the city with purpose: smoother work, better access, stronger systems.",
      ],
      tags: ["Impact", "Systems", "Human Tech"],
    },
  },

  {
    id: "systems-puzzle-bay",
    kind: "puzzle",
    title: "Systems Logic Puzzle Bay",
    x: 3370,
    y: 7060,
    w: 560,
    h: 220,
    angle: -0.38,
    color: "#f6f388",
    puzzle: {
      question:
        "A messy business workflow has repeated manual reporting errors. What should be done first?",
      options: [
        "Automate immediately",
        "Map the actual process and failure points",
        "Buy a bigger dashboard",
      ],
      answer: 1,
      explanation:
        "Great systems start by understanding the real workflow and the exact failure points. Automation comes after clarity.",
    },
  },
  {
    id: "hci-puzzle-bay",
    kind: "puzzle",
    title: "Blind-First HCI Puzzle Bay",
    x: 10070,
    y: 5420,
    w: 560,
    h: 220,
    angle: -0.32,
    color: "#a7f3d0",
    puzzle: {
      question:
        "For a blind-first learning tool, which interaction should be reliable even without the screen?",
      options: [
        "Voice and keyboard feedback",
        "Large decorative images",
        "Hidden hover animations",
      ],
      answer: 0,
      explanation:
        "Blind-first UX must work through audio, tactile, keyboard, and predictable state feedback before visual polish.",
    },
  },
  {
    id: "supply-puzzle-bay",
    kind: "puzzle",
    title: "Supply Chain Puzzle Bay",
    x: 13200,
    y: 3900,
    w: 560,
    h: 220,
    angle: -0.2,
    color: "#34d399",
    puzzle: {
      question:
        "If a SKU is available but mapped to the wrong product ID, what breaks first?",
      options: [
        "The city lighting",
        "Availability and price reporting accuracy",
        "The car steering",
      ],
      answer: 1,
      explanation:
        "SKU mapping is the backbone of digital shelf reporting. Wrong mapping makes OLA, CPP, and availability decisions unreliable.",
    },
  },
];
const buildings: Building[] = [
  {
    x: 690,
    y: 6160,
    w: 250,
    h: 460,
    floors: 21,
    color: "#172033",
    side: "#0b1222",
    roof: "#293448",
    accent: "#f6f388",
    label: "IUT",
  },
  {
    x: 1110,
    y: 6040,
    w: 280,
    h: 560,
    floors: 26,
    color: "#12213a",
    side: "#081224",
    roof: "#324055",
    accent: "#a7f3d0",
    label: "CSE",
  },
  {
    x: 1580,
    y: 6190,
    w: 250,
    h: 410,
    floors: 19,
    color: "#162238",
    side: "#0a1324",
    roof: "#2a3348",
    accent: "#7dd3fc",
    label: "Systems",
  },
  {
    x: 2200,
    y: 6350,
    w: 230,
    h: 360,
    floors: 16,
    color: "#141d31",
    side: "#090f1d",
    roof: "#31384a",
    accent: "#f6f388",
    label: "Ops",
  },

  {
    x: 4200,
    y: 4500,
    w: 300,
    h: 760,
    floors: 38,
    color: "#0f2438",
    side: "#071525",
    roof: "#233c52",
    accent: "#7dd3fc",
    label: "Ops",
    tier: 1,
  },
  {
    x: 4640,
    y: 4240,
    w: 380,
    h: 1040,
    floors: 54,
    color: "#0b2437",
    side: "#071322",
    roof: "#25455d",
    accent: "#67e8f9",
    label: "Errum",
    landmark: true,
    tier: 2,
  },
  {
    x: 5160,
    y: 4390,
    w: 340,
    h: 880,
    floors: 46,
    color: "#18243a",
    side: "#0d1325",
    roof: "#384057",
    accent: "#f6f388",
    label: "Deshio",
    tier: 1,
  },
  {
    x: 5650,
    y: 4570,
    w: 310,
    h: 700,
    floors: 36,
    color: "#1c2338",
    side: "#101525",
    roof: "#3b3347",
    accent: "#ffb8d1",
    label: "mADestic",
  },
  {
    x: 6120,
    y: 4820,
    w: 285,
    h: 520,
    floors: 27,
    color: "#13263a",
    side: "#081625",
    roof: "#2d4253",
    accent: "#a7f3d0",
    label: "Sareng",
  },
  {
    x: 6600,
    y: 5000,
    w: 245,
    h: 410,
    floors: 21,
    color: "#172036",
    side: "#0b1221",
    roof: "#293144",
    accent: "#c4b5fd",
    label: "Web",
  },

  {
    x: 7520,
    y: 5050,
    w: 270,
    h: 610,
    floors: 33,
    color: "#0f2930",
    side: "#061719",
    roof: "#24434a",
    accent: "#a7f3d0",
    label: "Okkhi",
  },
  {
    x: 7970,
    y: 4780,
    w: 360,
    h: 870,
    floors: 47,
    color: "#0d2a2e",
    side: "#061617",
    roof: "#284c4c",
    accent: "#a7f3d0",
    label: "ABCD",
    landmark: true,
    tier: 2,
  },
  {
    x: 8500,
    y: 4920,
    w: 320,
    h: 720,
    floors: 39,
    color: "#132738",
    side: "#071522",
    roof: "#2d4052",
    accent: "#7dd3fc",
    label: "Srobon",
    tier: 1,
  },
  {
    x: 9000,
    y: 5120,
    w: 270,
    h: 540,
    floors: 29,
    color: "#16243a",
    side: "#0b1324",
    roof: "#333850",
    accent: "#c4b5fd",
    label: "HCI",
  },
  {
    x: 9440,
    y: 5260,
    w: 240,
    h: 420,
    floors: 22,
    color: "#112b2a",
    side: "#071817",
    roof: "#244542",
    accent: "#a7f3d0",
    label: "Voice",
  },

  {
    x: 10760,
    y: 2640,
    w: 300,
    h: 680,
    floors: 35,
    color: "#102e25",
    side: "#061913",
    roof: "#26483f",
    accent: "#34d399",
    label: "UBL",
  },
  {
    x: 11220,
    y: 2260,
    w: 430,
    h: 1080,
    floors: 58,
    color: "#0e2b33",
    side: "#07171b",
    roof: "#245260",
    accent: "#34d399",
    label: "Digital Shelf",
    landmark: true,
    tier: 2,
  },
  {
    x: 11820,
    y: 2380,
    w: 360,
    h: 900,
    floors: 47,
    color: "#15273a",
    side: "#091522",
    roof: "#2d445a",
    accent: "#7dd3fc",
    label: "Reports",
    tier: 1,
  },
  {
    x: 12360,
    y: 2520,
    w: 330,
    h: 760,
    floors: 39,
    color: "#1a2535",
    side: "#0d1320",
    roof: "#394258",
    accent: "#f6f388",
    label: "SKU",
  },
  {
    x: 12840,
    y: 2700,
    w: 290,
    h: 600,
    floors: 31,
    color: "#113029",
    side: "#071813",
    roof: "#284940",
    accent: "#34d399",
    label: "OLA",
  },

  {
    x: 13370,
    y: 3680,
    w: 290,
    h: 560,
    floors: 30,
    color: "#2a1b2a",
    side: "#170d17",
    roof: "#473247",
    accent: "#fda4af",
    label: "ROFS",
  },
  {
    x: 13860,
    y: 3460,
    w: 370,
    h: 780,
    floors: 43,
    color: "#241d37",
    side: "#130e20",
    roof: "#473b5f",
    accent: "#fda4af",
    label: "RBC",
    landmark: true,
    tier: 2,
  },
  {
    x: 14420,
    y: 3660,
    w: 330,
    h: 620,
    floors: 34,
    color: "#192034",
    side: "#0c101d",
    roof: "#38405a",
    accent: "#f6f388",
    label: "Positive One",
  },
  {
    x: 14930,
    y: 3780,
    w: 300,
    h: 520,
    floors: 29,
    color: "#251c31",
    side: "#130e1b",
    roof: "#463853",
    accent: "#c4b5fd",
    label: "Teams",
  },

  {
    x: 15560,
    y: 870,
    w: 330,
    h: 620,
    floors: 34,
    color: "#182042",
    side: "#0b1025",
    roof: "#373c63",
    accent: "#c4b5fd",
    label: "Agents",
  },
  {
    x: 16040,
    y: 560,
    w: 440,
    h: 930,
    floors: 52,
    color: "#162034",
    side: "#0a101c",
    roof: "#2d4561",
    accent: "#67e8f9",
    label: "HCI Lab",
    landmark: true,
    tier: 2,
  },
  {
    x: 16680,
    y: 760,
    w: 360,
    h: 720,
    floors: 41,
    color: "#1f1d38",
    side: "#111020",
    roof: "#454266",
    accent: "#c4b5fd",
    label: "Japan",
    tier: 1,
  },
  {
    x: 17220,
    y: 960,
    w: 300,
    h: 560,
    floors: 31,
    color: "#0f2832",
    side: "#07151b",
    roof: "#294450",
    accent: "#a7f3d0",
    label: "Impact",
  },
];

const tourWaypoints: Point[] = [
  { x: 690, y: 7820 },
  { x: 1640, y: 7820 },
  { x: 2860, y: 7410 },
  { x: 4200, y: 6680 },
  { x: 5560, y: 6260 },
  { x: 6920, y: 6040 },
  { x: 8180, y: 5520 },
  { x: 9580, y: 5020 },
  { x: 11040, y: 4520 },
  { x: 12520, y: 4040 },
  { x: 14020, y: 3420 },
  { x: 15650, y: 2600 },
  { x: 17450, y: 1940 },
  { x: 16800, y: 2600 },
  { x: 15000, y: 4200 },
  { x: 9080, y: 6900 },
  { x: 7040, y: 6040 },
];

const floorMarks = ["#fff7a8", "#9be8ff", "#a7f3d0", "#ffc3da", "#c4b5fd"];
const carPalette = ["#f6f388", "#67e8f9", "#fda4af", "#c4b5fd", "#ffffff"];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function rgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const num = parseInt(value, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 4,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
      return;
    }
    if (current) lines.push(current);
    current = word;
  });
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const clipped = lines.slice(0, maxLines);
    clipped[maxLines - 1] = `${clipped[maxLines - 1].replace(/\.*$/, "")}...`;
    return clipped;
  }
  return lines;
}

function smoothPath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  sx: (x: number) => number,
  sy: (y: number) => number,
) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(sx(points[0].x), sy(points[0].y));
  if (points.length === 2) {
    ctx.lineTo(sx(points[1].x), sy(points[1].y));
    return;
  }
  for (let i = 1; i < points.length - 1; i += 1) {
    const mid = {
      x: (points[i].x + points[i + 1].x) / 2,
      y: (points[i].y + points[i + 1].y) / 2,
    };
    ctx.quadraticCurveTo(
      sx(points[i].x),
      sy(points[i].y),
      sx(mid.x),
      sy(mid.y),
    );
  }
  const last = points[points.length - 1];
  ctx.lineTo(sx(last.x), sy(last.y));
}

function pathLength(points: Point[]) {
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1)
    total += distance(points[i], points[i + 1]);
  return total;
}

function pointAtDistance(points: Point[], dist: number) {
  const total = pathLength(points);
  let remaining = ((dist % total) + total) % total;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const len = distance(a, b);
    if (remaining <= len) {
      const t = remaining / len;
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        angle: Math.atan2(b.y - a.y, b.x - a.x),
      };
    }
    remaining -= len;
  }
  const last = points[points.length - 1];
  return { x: last.x, y: last.y, angle: 0 };
}

function pointInRotatedRect(point: Point, zone: ParkingZone, padding = 0) {
  const dx = point.x - zone.x;
  const dy = point.y - zone.y;
  const cos = Math.cos(-zone.angle);
  const sin = Math.sin(-zone.angle);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  return (
    Math.abs(localX) <= zone.w / 2 + padding &&
    Math.abs(localY) <= zone.h / 2 + padding
  );
}

function getParkedZone(car: Car) {
  if (Math.abs(car.speed) > 62) return null;
  return parkingZones.find((zone) => pointInRotatedRect(car, zone, 26)) || null;
}

function lineDashes(
  ctx: CanvasRenderingContext2D,
  a: Point,
  b: Point,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
  offset = 0,
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;
  const ux = dx / len;
  const uy = dy / len;
  const dash = 90;
  const gap = 95;
  const cycle = dash + gap;
  let start = ((frame * 0.48 + offset) % cycle) - cycle;
  while (start < len) {
    const end = Math.min(start + dash, len);
    if (end > 0) {
      const s = Math.max(0, start);
      ctx.beginPath();
      ctx.moveTo(sx(a.x + ux * s), sy(a.y + uy * s));
      ctx.lineTo(sx(a.x + ux * end), sy(a.y + uy * end));
      ctx.stroke();
    }
    start += cycle;
  }
}

export default function CityDrive() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const carRef = useRef<Car>({ ...START });
  const keysRef = useRef<Keys>({});
  const autoTourRef = useRef(false);
  const tourIndexRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [nearby, setNearby] = useState<Checkpoint | null>(null);
  const [minimap, setMinimap] = useState({
    x: START.x / WORLD.width,
    y: START.y / WORLD.height,
  });
  const [autoTour, setAutoTour] = useState(false);
  const [cinematic, setCinematic] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeParking, setActiveParking] = useState<ParkingZone | null>(null);
  const [puzzleResults, setPuzzleResults] = useState<
    Record<string, boolean | null>
  >({});

  const startExperience = () => {
    startedRef.current = true;
    setStarted(true);
  };

  const setKey = (key: string, value: boolean) => {
    keysRef.current[key] = value;
    if (value) startExperience();
  };

  const toggleTour = () => {
    startExperience();
    autoTourRef.current = !autoTourRef.current;
    setAutoTour(autoTourRef.current);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (
        [
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "w",
          "a",
          "s",
          "d",
          "t",
          "c",
          " ",
        ].includes(key)
      ) {
        event.preventDefault();
      }
      if (key === "t") {
        toggleTour();
        return;
      }
      if (key === "c") {
        setCinematic((value) => !value);
        return;
      }
      keysRef.current[key] = true;
      if (
        [
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "w",
          "a",
          "s",
          "d",
        ].includes(key)
      ) {
        autoTourRef.current = false;
        setAutoTour(false);
      }
      if (!startedRef.current) startExperience();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      frame += 1;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const baseScale =
        width < 720 ? 0.5 : width < 1050 ? 0.58 : width < 1500 ? 0.66 : 0.74;
      const scale = cinematic ? baseScale : baseScale * 0.54;
      const car = carRef.current;
      const keys = keysRef.current;

      updateCar(car, keys, dt, autoTourRef.current, tourIndexRef);

      const nearest = checkpoints.reduce<Checkpoint | null>((winner, point) => {
        const dist = distance(point, car);
        if (dist > point.radius + 1120) return winner;
        if (!winner) return point;
        return dist < distance(winner, car) ? point : winner;
      }, null);
      const parkedZone = getParkedZone(car);

      if (frame % 8 === 0) {
        setNearby((current) =>
          current?.id === nearest?.id ? current : nearest,
        );
        setMinimap({ x: car.x / WORLD.width, y: car.y / WORLD.height });
        setProgress(clamp(car.x / WORLD.width, 0, 1));
        setActiveParking((current) =>
          current?.id === parkedZone?.id ? current : parkedZone,
        );
      }

      const cameraLead = cinematic ? 520 : 120;
      const camera = {
        x: car.x + Math.cos(car.angle) * cameraLead,
        y: car.y + Math.sin(car.angle) * cameraLead,
      };
      const sx = (x: number) => (x - camera.x) * scale + width / 2;
      const sy = (y: number) => (y - camera.y) * scale + height / 2;
      const sw = (value: number) => value * scale;

      ctx.clearRect(0, 0, width, height);
      drawSky(ctx, width, height, frame);
      drawWorldBase(ctx, sx, sy, sw, width, height, frame);
      drawDistrictGround(ctx, sx, sy, sw, frame);
      drawHarbor(ctx, sx, sy, sw, frame);
      drawParks(ctx, sx, sy, sw, frame);
      drawRoads(ctx, sx, sy, sw, frame);
      drawParkingZones(ctx, sx, sy, sw, frame, car, parkedZone?.id);
      drawStreetDetails(ctx, sx, sy, sw, frame);
      drawTraffic(ctx, sx, sy, sw, frame);
      drawBuildings(ctx, sx, sy, sw, frame, car);
      drawDistrictLandmarks(ctx, sx, sy, sw, frame);
      drawStoryPanels(ctx, sx, sy, sw, frame, car, nearest?.id);
      drawRouteHints(ctx, sx, sy, sw, frame);
      drawHeroCar(ctx, sx(car.x), sy(car.y), car.angle, scale, frame);
      drawHudCanvas(
        ctx,
        width,
        height,
        car.speed,
        nearest,
        autoTourRef.current,
        cinematic,
        parkedZone,
      );

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cinematic]);

  return (
    <section
      id="drive"
      className="relative h-screen min-h-[760px] overflow-hidden border-b border-white/10 bg-black pt-16"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Interactive realistic portfolio city driving canvas"
      />

      {!started && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#02040a]/35 px-6 backdrop-blur-[2px]">
          <div className="relative max-w-5xl overflow-hidden rounded-[2.4rem] border border-white/15 bg-[#05070d]/65 p-8 text-center shadow-[0_50px_170px_rgba(0,0,0,0.68)] backdrop-blur-2xl md:p-12">
            <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f6f388]/70 to-transparent" />
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#f6f388]/10 blur-3xl" />
            <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
            <p className="relative text-xs uppercase tracking-[0.52em] text-[#f6f388]">
              Phase 5.3 · building parking city
            </p>
            <h1 className="relative mt-5 text-5xl font-black leading-[0.93] tracking-[-0.065em] md:text-7xl">
              Your portfolio as a living night city.
            </h1>
            <p className="relative mx-auto mt-6 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
              Every named building now has its own parking bay. Stop beside a tower to unlock that exact project, life chapter, or future direction.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={startExperience}
                className="rounded-full bg-[#f6f388] px-7 py-4 text-sm font-black text-black shadow-glow transition hover:scale-[1.03]"
              >
                Enter the City
              </button>
              <button
                onClick={toggleTour}
                className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:border-[#f6f388]/50"
              >
                Start Guided Drive
              </button>
              <a
                href="#classic"
                className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:border-[#f6f388]/50"
              >
                Quick Portfolio
              </a>
            </div>
            <p className="relative mt-6 text-xs text-white/45">
              Desktop: Arrow keys / WASD. Press T for guided drive. Press C for
              wide camera.
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-24 z-10 w-[min(410px,calc(100vw-2rem))] rounded-[1.45rem] border border-white/10 bg-[#05070d]/36 p-4 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:left-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#f6f388]">
              Mueed City OS
            </p>
            <h2 className="mt-2 text-lg font-black tracking-[-0.04em]">
              Realistic night drive
            </h2>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold text-white/60">
            v5.3
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#f6f388] via-cyan-300 to-purple-300"
            style={{ width: `${Math.max(4, progress * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-5 text-white/55">
          Every major building has its own parking bay. Stop beside a building to unlock its exact story; puzzle bays still appear beside selected roads.
        </p>
        {nearby && (
          <p className="mt-3 text-xs font-bold text-[#f6f388]">
            Now entering: {nearby.title}
          </p>
        )}
      </div>

      <div className="absolute right-4 top-24 z-10 h-32 w-56 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#05070d]/42 p-3 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:right-6">
        <div className="relative h-full w-full rounded-[1rem] bg-[#07101d]">
          <MiniRoad road={roadPaths[0]} />
          {checkpoints.map((point) => (
            <span
              key={point.id}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6f388] shadow-glow"
              style={{
                left: `${(point.x / WORLD.width) * 100}%`,
                top: `${(point.y / WORLD.height) * 100}%`,
              }}
            />
          ))}
          <span
            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-cyan-300 shadow-cyan"
            style={{ left: `${minimap.x * 100}%`, top: `${minimap.y * 100}%` }}
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#05070d]/48 p-2 shadow-[0_28px_100px_rgba(0,0,0,0.50)] backdrop-blur-2xl md:flex">
        <button
          onClick={toggleTour}
          className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-xs font-black text-white/80 transition hover:border-[#f6f388]/50 hover:text-[#f6f388]"
        >
          {autoTour ? "Stop Guided Drive" : "Guided Drive"}
        </button>
        <button
          onClick={() => setCinematic((value) => !value)}
          className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-xs font-black text-white/80 transition hover:border-[#f6f388]/50 hover:text-[#f6f388]"
        >
          {cinematic ? "Wide Camera" : "Cinematic Camera"}
        </button>
        <a
          href="#classic"
          className="rounded-full bg-[#f6f388] px-5 py-3 text-xs font-black text-black shadow-glow transition hover:scale-[1.02]"
        >
          Quick Portfolio
        </a>
      </div>

      {activeParking && (
        <ParkingModal
          zone={activeParking}
          result={puzzleResults[activeParking.id]}
          onAnswer={(isCorrect) =>
            setPuzzleResults((current) => ({
              ...current,
              [activeParking.id]: isCorrect,
            }))
          }
        />
      )}

      <MobileControls
        setKey={setKey}
        toggleTour={toggleTour}
        autoTour={autoTour}
      />
    </section>
  );
}

function ParkingModal({
  zone,
  result,
  onAnswer,
}: {
  zone: ParkingZone;
  result?: boolean | null;
  onAnswer: (isCorrect: boolean) => void;
}) {
  const checkpoint = zone.checkpointId
    ? checkpoints.find((item) => item.id === zone.checkpointId)
    : null;
  const project = zone.projectSlug ? getProject(zone.projectSlug) : null;
  const detail = zone.detail;
  const isPuzzle = zone.kind === "puzzle" && zone.puzzle;

  return (
    <div className="pointer-events-auto absolute bottom-24 right-5 z-30 w-[min(520px,calc(100vw-2.5rem))] overflow-hidden rounded-[2rem] border border-white/15 bg-[#05070d]/78 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.70)] backdrop-blur-2xl md:bottom-24 md:right-6">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.35em]"
            style={{ color: zone.color }}
          >
            {isPuzzle ? "Puzzle parking bay" : "Project parking unlocked"}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
            {zone.title}
          </h3>
        </div>
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 text-lg font-black"
          style={{ color: zone.color }}
        >
          P
        </span>
      </div>

      {isPuzzle ? (
        <div>
          <p className="text-sm leading-6 text-white/72">
            {zone.puzzle!.question}
          </p>
          <div className="mt-4 grid gap-2">
            {zone.puzzle!.options.map((option, index) => (
              <button
                key={option}
                onClick={() => onAnswer(index === zone.puzzle!.answer)}
                className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-left text-sm font-bold text-white/78 transition hover:border-white/30 hover:bg-white/[0.12]"
              >
                {option}
              </button>
            ))}
          </div>
          {result !== undefined && result !== null && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${result ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100" : "border-rose-300/25 bg-rose-300/10 text-rose-100"}`}
            >
              <strong>{result ? "Correct." : "Not quite."}</strong>{" "}
              {zone.puzzle!.explanation}
            </div>
          )}
        </div>
      ) : (
        <div>
          {detail ? (
            <>
              <p className="text-sm font-bold" style={{ color: zone.color }}>
                {detail.subtitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {detail.description}
              </p>
              <div className="mt-4 grid gap-2">
                {detail.bullets.map((bullet) => (
                  <p
                    key={bullet}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/70"
                  >
                    — {bullet}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {detail.tags.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
              {project && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-white/42">
                    Full case-study link
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    This building is also connected to the classic case study: {project.title}.
                  </p>
                </div>
              )}
            </>
          ) : project ? (
            <>
              <p className="text-sm font-bold" style={{ color: zone.color }}>
                {project.district}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {project.problem}
              </p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-white/42">
                  Solution
                </p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {project.solution}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.slice(0, 6).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </>
          ) : checkpoint ? (
            <>
              <p className="text-sm leading-6 text-white/72">
                {checkpoint.summary}
              </p>
              <div className="mt-4 grid gap-2">
                {checkpoint.bullets.map((bullet) => (
                  <p
                    key={bullet}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/70"
                  >
                    — {bullet}
                  </p>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      <p className="mt-4 text-xs text-white/38">
        Drive away from the parking zone to close this card.
      </p>
    </div>
  );
}

function MiniRoad({ road }: { road: RoadPath }) {
  const points = road.points
    .map(
      (point) =>
        `${(point.x / WORLD.width) * 100},${(point.y / WORLD.height) * 100}`,
    )
    .join(" ");
  return (
    <svg
      className="absolute inset-0 h-full w-full overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <polyline
        points={points}
        fill="none"
        stroke="rgba(255,255,255,0.20)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function updateCar(
  car: Car,
  keys: Keys,
  dt: number,
  autoTour: boolean,
  tourIndexRef: { current: number },
) {
  if (autoTour) {
    const target = tourWaypoints[tourIndexRef.current];
    const desired = Math.atan2(target.y - car.y, target.x - car.x);
    let delta = desired - car.angle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;

    // Guided drive is lively but no longer too fast around parking zones.
    car.angle += clamp(delta, -1.65 * dt, 1.65 * dt);
    car.speed += 360 * dt;
    car.speed = clamp(car.speed, 0, 360);
    if (distance(car, target) < 190)
      tourIndexRef.current = (tourIndexRef.current + 1) % tourWaypoints.length;
  } else {
    const accelerating = keys.arrowup || keys.w;
    const braking = keys.arrowdown || keys.s;
    const left = keys.arrowleft || keys.a;
    const right = keys.arrowright || keys.d;

    // Tuned down from v5.1: still responsive, but easier to park and read the city.
    if (accelerating) car.speed += 620 * dt;
    if (braking) car.speed -= 540 * dt;
    car.speed *= 0.984;
    car.speed = clamp(car.speed, -180, 500);

    const turnPower = clamp(Math.abs(car.speed) / 360, 0.32, 0.86);
    const steering = 2.55 * turnPower * dt * Math.sign(car.speed || 1);
    if (left) car.angle -= steering;
    if (right) car.angle += steering;
  }
  car.x += Math.cos(car.angle) * car.speed * dt;
  car.y += Math.sin(car.angle) * car.speed * dt;
  car.x = clamp(car.x, 160, WORLD.width - 160);
  car.y = clamp(car.y, 160, WORLD.height - 160);
}

function MobileControls({
  setKey,
  toggleTour,
  autoTour,
}: {
  setKey: (key: string, value: boolean) => void;
  toggleTour: () => void;
  autoTour: boolean;
}) {
  const button = (label: string, key: string) => (
    <button
      aria-label={label}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setKey(key, true);
      }}
      onPointerUp={(event) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        setKey(key, false);
      }}
      onPointerCancel={() => setKey(key, false)}
      className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/15 text-xl font-black text-white backdrop-blur-xl active:scale-95"
    >
      {label}
    </button>
  );

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between gap-4 md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <span />
        {button("↑", "arrowup")}
        <span />
        {button("←", "arrowleft")}
        {button("↓", "arrowdown")}
        {button("→", "arrowright")}
      </div>
      <button
        onClick={toggleTour}
        className="h-16 rounded-2xl border border-[#f6f388]/25 bg-[#f6f388] px-5 text-sm font-black text-black shadow-glow"
      >
        {autoTour ? "Stop" : "Tour"}
      </button>
    </div>
  );
}

function drawSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number,
) {
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#02040d");
  bg.addColorStop(0.28, "#071225");
  bg.addColorStop(0.62, "#0d1a2d");
  bg.addColorStop(1, "#02040a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glowA = ctx.createRadialGradient(
    width * 0.72,
    height * 0.18,
    0,
    width * 0.72,
    height * 0.18,
    width * 0.7,
  );
  glowA.addColorStop(0, "rgba(125,211,252,0.22)");
  glowA.addColorStop(0.36, "rgba(196,181,253,0.10)");
  glowA.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(
    width * 0.18,
    height * 0.85,
    0,
    width * 0.18,
    height * 0.85,
    width * 0.5,
  );
  glowB.addColorStop(0, "rgba(246,243,136,0.10)");
  glowB.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 120; i += 1) {
    const x = (i * 173 + frame * 0.012) % width;
    const y = (i * 79) % Math.max(1, height * 0.55);
    ctx.fillStyle = `rgba(255,255,255,${0.04 + ((i % 7) / 7) * 0.18})`;
    ctx.fillRect(x, y, 1.05, 1.05);
  }
}

function drawWorldBase(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  width: number,
  height: number,
  frame: number,
) {
  ctx.save();
  const glow = ctx.createRadialGradient(
    sx(9000),
    sy(4650),
    sw(300),
    sx(9000),
    sy(4650),
    sw(6500),
  );
  glow.addColorStop(0, "rgba(246,243,136,0.075)");
  glow.addColorStop(0.36, "rgba(34,211,238,0.055)");
  glow.addColorStop(0.72, "rgba(196,181,253,0.030)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const block = 320;
  for (let x = 0; x <= WORLD.width; x += block) {
    for (let y = 0; y <= WORLD.height; y += block) {
      const alpha = (x / block + y / block) % 2 === 0 ? 0.012 : 0.005;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(sx(x), sy(y), sw(block), sw(block));
    }
  }

  for (let i = 0; i < 7; i += 1) {
    const fog = ctx.createLinearGradient(
      sx(0),
      sy(800 + i * 900),
      sx(WORLD.width),
      sy(980 + i * 900),
    );
    fog.addColorStop(0, "rgba(255,255,255,0)");
    fog.addColorStop(0.5, "rgba(255,255,255,0.020)");
    fog.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = fog;
    ctx.fillRect(
      sx(((frame * 0.14 + i * 780) % WORLD.width) - WORLD.width),
      sy(680 + i * 900),
      sw(WORLD.width * 2),
      sw(240),
    );
  }
  ctx.restore();
}

function drawDistrictGround(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
) {
  districts.forEach((district, index) => {
    const x = sx(district.x);
    const y = sy(district.y);
    const w = sw(district.w);
    const h = sw(district.h);
    ctx.save();
    const glow = ctx.createRadialGradient(
      x + w / 2,
      y + h / 2,
      0,
      x + w / 2,
      y + h / 2,
      Math.max(w, h) * 0.9,
    );
    glow.addColorStop(0, rgba(district.color, 0.11));
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - w * 0.3, y - h * 0.4, w * 1.6, h * 1.8);
    ctx.fillStyle = "rgba(5,14,24,0.34)";
    roundRect(ctx, x, y, w, h, sw(80));
    ctx.fill();
    ctx.strokeStyle = rgba(district.color, 0.2);
    ctx.lineWidth = sw(2);
    ctx.stroke();
    ctx.font = `700 ${Math.max(10, sw(16))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillStyle = rgba(
      district.color,
      0.42 + Math.sin(frame / 32 + index) * 0.04,
    );
    ctx.fillText(district.label.toUpperCase(), x + w / 2, y + sw(42));
    ctx.restore();
  });
}

function drawHarbor(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
) {
  ctx.save();
  const x = sx(15420);
  const y = sy(2320);
  const w = sw(2550);
  const h = sw(1780);
  const water = ctx.createLinearGradient(x, y, x + w, y + h);
  water.addColorStop(0, "rgba(14,165,233,0.20)");
  water.addColorStop(0.45, "rgba(34,211,238,0.10)");
  water.addColorStop(1, "rgba(6,78,109,0.06)");
  ctx.fillStyle = water;
  roundRect(ctx, x, y, w, h, sw(170));
  ctx.fill();
  ctx.strokeStyle = "rgba(125,211,252,0.26)";
  ctx.lineWidth = sw(4);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = sw(2);
  for (let i = 0; i < 23; i += 1) {
    const yy = 2460 + i * 70 + Math.sin(frame / 24 + i) * 12;
    ctx.beginPath();
    ctx.moveTo(sx(15580), sy(yy));
    ctx.bezierCurveTo(
      sx(16100),
      sy(yy + Math.sin(i) * 30),
      sx(16800),
      sy(yy - 10),
      sx(17700),
      sy(yy + Math.sin(frame / 35 + i) * 16),
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawParks(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
) {
  parks.forEach((park, index) => {
    ctx.save();
    const x = sx(park.x);
    const y = sy(park.y);
    const w = sw(park.w);
    const h = sw(park.h);
    const glow = ctx.createRadialGradient(
      x + w / 2,
      y + h / 2,
      sw(20),
      x + w / 2,
      y + h / 2,
      Math.max(w, h),
    );
    glow.addColorStop(0, rgba(park.color, 0.18));
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - w * 0.25, y - h * 0.25, w * 1.5, h * 1.5);
    const grass = ctx.createLinearGradient(x, y, x + w, y + h);
    grass.addColorStop(0, "rgba(12,50,42,0.64)");
    grass.addColorStop(1, "rgba(5,28,26,0.50)");
    ctx.fillStyle = grass;
    roundRect(ctx, x, y, w, h, sw(52));
    ctx.fill();
    ctx.strokeStyle = rgba(park.color, 0.34);
    ctx.lineWidth = sw(2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.setLineDash([sw(40), sw(30)]);
    ctx.beginPath();
    ctx.moveTo(x + sw(60), y + h * 0.55);
    ctx.bezierCurveTo(
      x + w * 0.25,
      y + sw(60),
      x + w * 0.7,
      y + h * 0.2,
      x + w - sw(70),
      y + h * 0.62,
    );
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = rgba(park.color, 0.82);
    ctx.font = `${Math.max(11, sw(17))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(park.label, x + w / 2, y + h - sw(36));
    for (let i = 0; i < 42; i += 1) {
      const px =
        x + sw(65 + ((i * 103 + index * 47) % Math.max(1, park.w - 130)));
      const py =
        y + sw(60 + ((i * 71 + index * 53) % Math.max(1, park.h - 130)));
      drawTree(ctx, px, py, sw(1.28), frame + i * 4);
    }
    ctx.restore();
  });
}

function drawRoads(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
) {
  const surfaceColor = (road: RoadPath) => {
    if (road.kind === "express") return "#111b2c";
    if (road.kind === "garden") return "#10212a";
    if (road.kind === "harbor") return "#0f2336";
    return "#121c2d";
  };

  const collectJunctions = () => {
    const nodes: Array<Point & { radius: number; weight: number }> = [];
    roadPaths.forEach((road) => {
      road.points.forEach((point, index) => {
        const isTerminal = index === 0 || index === road.points.length - 1;
        const isMainNode =
          road.kind === "express" &&
          index > 0 &&
          index < road.points.length - 1;
        const candidateRadius =
          road.width * (isTerminal || isMainNode ? 0.62 : 0.44) + 74;
        const existing = nodes.find((node) => distance(node, point) < 230);
        if (existing) {
          existing.x =
            (existing.x * existing.weight + point.x) / (existing.weight + 1);
          existing.y =
            (existing.y * existing.weight + point.y) / (existing.weight + 1);
          existing.radius = Math.max(existing.radius, candidateRadius);
          existing.weight += 1;
        } else {
          nodes.push({ ...point, radius: candidateRadius, weight: 1 });
        }
      });
    });
    return nodes.filter((node) => node.weight > 1 || node.radius > 240);
  };

  const junctions = collectJunctions();

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // 1) Paint every road shadow first. This prevents ugly stacked overlaps at crossings.
  roadPaths.forEach((road) => {
    const isMain = road.kind === "express";
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = isMain
      ? "rgba(34,211,238,0.34)"
      : road.kind === "harbor"
        ? "rgba(125,211,252,0.24)"
        : "rgba(246,243,136,0.12)";
    ctx.shadowBlur = isMain ? 42 : 20;
    ctx.strokeStyle = isMain
      ? "rgba(34,211,238,0.17)"
      : "rgba(255,255,255,0.07)";
    ctx.lineWidth = sw(road.width + 72);
    smoothPath(ctx, road.points, sx, sy);
    ctx.stroke();
    ctx.restore();
  });

  // 2) Unified dark road bed for all roads.
  roadPaths.forEach((road) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(0,0,0,0.54)";
    ctx.lineWidth = sw(road.width + 48);
    smoothPath(ctx, road.points, sx, sy);
    ctx.stroke();
    ctx.restore();
  });

  // 3) Unified asphalt surface.
  roadPaths.forEach((road) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = surfaceColor(road);
    ctx.lineWidth = sw(road.width);
    smoothPath(ctx, road.points, sx, sy);
    ctx.stroke();
    ctx.restore();
  });

  // 4) Smooth intersection pads. These blend roads before curbs/lanes are drawn.
  junctions.forEach((node, index) => {
    const x = sx(node.x);
    const y = sy(node.y);
    const r = sw(node.radius);
    ctx.save();
    ctx.shadowColor = "rgba(34,211,238,0.24)";
    ctx.shadowBlur = sw(24);

    const pad = ctx.createRadialGradient(x, y, r * 0.08, x, y, r * 1.05);
    pad.addColorStop(0, "#172235");
    pad.addColorStop(0.65, "#101a2b");
    pad.addColorStop(1, "rgba(4,8,16,0.92)");
    ctx.fillStyle = pad;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      r * 1.05,
      r * 0.72,
      Math.sin(index) * 0.36,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(125,211,252,0.26)";
    ctx.lineWidth = sw(5);
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      r * 1.04,
      r * 0.7,
      Math.sin(index) * 0.36,
      0,
      Math.PI * 2,
    );
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.065)";
    ctx.lineWidth = sw(2);
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      r * 0.62,
      r * 0.4,
      Math.sin(index) * 0.36,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.restore();
  });

  // 5) Soft road shoulders / curbs after junction blending.
  roadPaths.forEach((road) => {
    const isMain = road.kind === "express";
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = isMain
      ? "rgba(34,211,238,0.50)"
      : road.kind === "harbor"
        ? "rgba(125,211,252,0.36)"
        : "rgba(255,255,255,0.13)";
    ctx.lineWidth = sw(5.5);
    smoothPath(ctx, road.points, sx, sy);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.040)";
    ctx.lineWidth = sw(Math.max(32, road.width - 52));
    smoothPath(ctx, road.points, sx, sy);
    ctx.stroke();
    ctx.restore();
  });

  // 6) Asphalt grain. Kept subtle and under lane markers.
  roadPaths.forEach((road) => {
    ctx.save();
    ctx.globalAlpha = 0.1;
    road.points.slice(0, -1).forEach((point, index) => {
      const next = road.points[index + 1];
      const len = distance(point, next);
      if (len < 1) return;
      const ux = (next.x - point.x) / len;
      const uy = (next.y - point.y) / len;
      const nx = -uy;
      const ny = ux;
      for (let i = 0; i < 18; i += 1) {
        const d = (i * 181 + frame * 0.42 + index * 97) % len;
        const off = ((i * 53) % road.width) - road.width / 2;
        ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.18)";
        ctx.fillRect(
          sx(point.x + ux * d + nx * off),
          sy(point.y + uy * d + ny * off),
          Math.max(1, sw(2)),
          Math.max(1, sw(2)),
        );
      }
    });
    ctx.restore();
  });

  // 7) Lane markers, trimmed near junctions so crossings do not become messy scribbles.
  roadPaths.forEach((road) => {
    const isMain = road.kind === "express";
    const laneOffsets = isMain ? [-road.width * 0.18, road.width * 0.18] : [0];
    laneOffsets.forEach((laneOffset, laneIndex) => {
      ctx.save();
      ctx.strokeStyle =
        laneIndex === 0 && isMain
          ? "rgba(246,243,136,0.68)"
          : "rgba(255,255,255,0.34)";
      ctx.lineWidth = sw(isMain ? 4.4 : 3.6);
      road.points.slice(0, -1).forEach((point, index) => {
        const next = road.points[index + 1];
        const len = distance(point, next);
        if (len < 260) return;
        const ux = (next.x - point.x) / len;
        const uy = (next.y - point.y) / len;
        const nx = -uy;
        const ny = ux;
        const trim = Math.min(len * 0.26, isMain ? 190 : 145);
        const start = {
          x: point.x + ux * trim + nx * laneOffset,
          y: point.y + uy * trim + ny * laneOffset,
        };
        const finish = {
          x: next.x - ux * trim + nx * laneOffset,
          y: next.y - uy * trim + ny * laneOffset,
        };
        lineDashes(
          ctx,
          start,
          finish,
          sx,
          sy,
          sw,
          frame,
          index * 53 + laneIndex * 31,
        );
      });
      ctx.restore();
    });
  });

  // 8) Cleaner intersection arrows and road names.
  roadPaths.forEach((road) => {
    const mid = road.points[Math.floor(road.points.length / 2)];
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.19)";
    ctx.font = `${Math.max(9, sw(13))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(
      road.label.toUpperCase(),
      sx(mid.x),
      sy(mid.y - road.width * 0.7),
    );
    ctx.restore();
  });

  ctx.restore();
}

function drawParkingZones(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
  car: Point,
  activeZoneId?: string,
) {
  parkingZones.forEach((zone, index) => {
    const dist = distance(car, zone);
    const visible = clamp(1 - (dist - 180) / 1700, 0, 1);
    if (visible <= 0.04) return;
    const active = activeZoneId === zone.id;
    const showText = active || dist < 980;
    const x = sx(zone.x);
    const y = sy(zone.y);
    const w = sw(zone.w);
    const h = sw(zone.h);

    ctx.save();
    ctx.globalAlpha = visible;
    ctx.translate(x, y);
    ctx.rotate(zone.angle);

    ctx.shadowColor = zone.color;
    ctx.shadowBlur = active ? sw(34) : sw(12);
    ctx.fillStyle = active ? rgba(zone.color, 0.22) : "rgba(5,10,18,0.58)";
    roundRect(ctx, -w / 2, -h / 2, w, h, sw(30));
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = rgba(zone.color, active ? 0.95 : 0.48);
    ctx.lineWidth = sw(active ? 4 : 2.4);
    ctx.stroke();

    // painted bay stripes
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = sw(2.2);
    const slots = Math.max(3, Math.floor(zone.w / 155));
    for (let i = 1; i < slots; i += 1) {
      const px = -w / 2 + (w * i) / slots;
      ctx.beginPath();
      ctx.moveTo(px, -h / 2 + sw(18));
      ctx.lineTo(px, h / 2 - sw(18));
      ctx.stroke();
    }

    ctx.fillStyle = rgba(zone.color, 0.14);
    roundRect(
      ctx,
      -w / 2 + sw(18),
      -h / 2 + sw(18),
      w - sw(36),
      sw(54),
      sw(18),
    );
    ctx.fill();
    ctx.fillStyle = zone.color;
    ctx.font = `900 ${Math.max(11, sw(16))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(
      showText ? (zone.kind === "puzzle" ? "PUZZLE BAY" : zone.title.toUpperCase()) : "P",
      0,
      -h / 2 + sw(50),
    );

    ctx.font = `900 ${Math.max(14, sw(25))}px ui-sans-serif, system-ui`;
    ctx.fillText("P", -w / 2 + sw(52), h / 2 - sw(42));
    if (showText) {
      ctx.font = `${Math.max(10, sw(14))}px ui-sans-serif, system-ui`;
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.fillText(
        active ? "Parked · details unlocked" : "Stop here to unlock",
        sw(42),
        h / 2 - sw(42),
      );
    }

    if (zone.kind === "puzzle") {
      const pulse = 0.5 + Math.sin(frame / 16 + index) * 0.5;
      ctx.fillStyle = rgba(zone.color, 0.2 + pulse * 0.15);
      ctx.beginPath();
      ctx.arc(w / 2 - sw(62), 0, sw(30 + pulse * 8), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = zone.color;
      ctx.font = `900 ${Math.max(14, sw(24))}px ui-sans-serif, system-ui`;
      ctx.fillText("?", w / 2 - sw(62), sw(9));
    }

    ctx.restore();
  });
}

function drawStreetDetails(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
) {
  const lamps: Point[] = [];
  roadPaths.forEach((road) => {
    road.points.slice(0, -1).forEach((point, index) => {
      const next = road.points[index + 1];
      const dx = next.x - point.x;
      const dy = next.y - point.y;
      const len = Math.hypot(dx, dy);
      if (len < 1) return;
      const ux = dx / len;
      const uy = dy / len;
      const nx = -uy;
      const ny = ux;
      for (let d = 200; d < len; d += road.kind === "express" ? 380 : 460) {
        lamps.push({
          x: point.x + ux * d + nx * (road.width * 0.64),
          y: point.y + uy * d + ny * (road.width * 0.64),
        });
        lamps.push({
          x: point.x + ux * d - nx * (road.width * 0.64),
          y: point.y + uy * d - ny * (road.width * 0.64),
        });
      }
    });
  });

  lamps.slice(0, 220).forEach((lamp, index) => {
    const x = sx(lamp.x);
    const y = sy(lamp.y);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, sw(92));
    glow.addColorStop(
      0,
      `rgba(246,243,136,${0.16 + Math.sin(frame / 28 + index) * 0.02})`,
    );
    glow.addColorStop(1, "rgba(246,243,136,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, sw(92), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(180,200,210,0.55)";
    ctx.fillRect(x - sw(1), y - sw(34), sw(2), sw(34));
    ctx.fillStyle = "#f6f388";
    ctx.beginPath();
    ctx.arc(x, y - sw(35), sw(4.5), 0, Math.PI * 2);
    ctx.fill();
  });

  // crosswalk / stop lines at chapter areas
  const crossings = [
    { x: 1070, y: 7820, angle: 0 },
    { x: 5540, y: 6260, angle: -0.28 },
    { x: 8260, y: 5500, angle: -0.35 },
    { x: 12550, y: 4040, angle: -0.32 },
    { x: 15650, y: 2600, angle: -0.46 },
  ];
  crossings.forEach((c) => {
    ctx.save();
    ctx.translate(sx(c.x), sy(c.y));
    ctx.rotate(c.angle);
    ctx.fillStyle = "rgba(255,255,255,0.20)";
    for (let i = -3; i <= 3; i += 1)
      ctx.fillRect(sw(-70), sw(i * 20 - 5), sw(140), sw(6));
    ctx.restore();
  });
}

function drawTraffic(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
) {
  const total = pathLength(mainBoulevard);
  for (let i = 0; i < 10; i += 1) {
    const lane = i % 2 === 0 ? -56 : 58;
    const p = pointAtDistance(
      mainBoulevard,
      (i * total) / 10 + frame * (2.2 + (i % 3) * 0.45),
    );
    const nx = -Math.sin(p.angle);
    const ny = Math.cos(p.angle);
    drawSmallCar(
      ctx,
      sx(p.x + nx * lane),
      sy(p.y + ny * lane),
      p.angle,
      sw(1),
      carPalette[i % carPalette.length],
      i % 2 === 0,
    );
  }
}

function drawSmallCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number,
  color: string,
  headlights: boolean,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  if (headlights) {
    const headlight = ctx.createLinearGradient(20 * scale, 0, 110 * scale, 0);
    headlight.addColorStop(0, "rgba(246,243,136,0.18)");
    headlight.addColorStop(1, "rgba(246,243,136,0)");
    ctx.fillStyle = headlight;
    ctx.beginPath();
    ctx.moveTo(20 * scale, -9 * scale);
    ctx.lineTo(110 * scale, -26 * scale);
    ctx.lineTo(110 * scale, 26 * scale);
    ctx.lineTo(20 * scale, 9 * scale);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  roundRect(
    ctx,
    -24 * scale,
    -12 * scale + 7 * scale,
    48 * scale,
    24 * scale,
    8 * scale,
  );
  ctx.fill();
  ctx.fillStyle = color;
  roundRect(ctx, -22 * scale, -12 * scale, 44 * scale, 24 * scale, 8 * scale);
  ctx.fill();
  ctx.fillStyle = "rgba(2,7,14,0.72)";
  roundRect(ctx, -4 * scale, -7 * scale, 16 * scale, 14 * scale, 5 * scale);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.fillRect(20 * scale, -6 * scale, 3 * scale, 5 * scale);
  ctx.fillRect(20 * scale, 1 * scale, 3 * scale, 5 * scale);
  ctx.restore();
}

function drawTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  frame: number,
) {
  ctx.save();
  ctx.fillStyle = "rgba(87,56,37,0.78)";
  ctx.fillRect(x - 2.3 * scale, y, 4.6 * scale, 18 * scale);
  const leaf = ctx.createRadialGradient(
    x,
    y - 8 * scale,
    0,
    x,
    y - 8 * scale,
    24 * scale,
  );
  leaf.addColorStop(0, "rgba(172,255,213,0.68)");
  leaf.addColorStop(1, "rgba(20,83,45,0.28)");
  ctx.fillStyle = leaf;
  ctx.beginPath();
  ctx.arc(
    x + Math.sin(frame / 22) * scale,
    y - 8 * scale,
    18 * scale,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}

function drawBuildings(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
  car: Point,
) {
  buildings
    .slice()
    .sort((a, b) => a.y + a.h - (b.y + b.h))
    .forEach((building, index) => {
      const center = {
        x: building.x + building.w / 2,
        y: building.y + building.h / 2,
      };
      const dist = distance(car, center);
      const alpha = clamp(1 - (dist - 3400) / 4200, 0.34, 1);
      const x = sx(building.x);
      const y = sy(building.y);
      const w = sw(building.w);
      const h = sw(building.h);
      const lift = sw(76 + building.floors * 1.7 + (building.tier || 0) * 30);
      const depth = sw(building.landmark ? 92 : 66);

      ctx.save();
      ctx.globalAlpha = alpha;
      const baseGlow = ctx.createRadialGradient(
        x + w / 2,
        y + h,
        0,
        x + w / 2,
        y + h,
        sw(540),
      );
      baseGlow.addColorStop(
        0,
        rgba(building.accent, building.landmark ? 0.22 : 0.09),
      );
      baseGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = baseGlow;
      ctx.fillRect(x - sw(290), y + h - sw(250), w + sw(580), sw(560));

      ctx.fillStyle = "rgba(0,0,0,0.48)";
      ctx.beginPath();
      ctx.ellipse(
        x + w / 2 + depth * 0.5,
        y + h + sw(30),
        w * 0.72,
        sw(60),
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // podium base
      const podium = ctx.createLinearGradient(
        x,
        y + h - sw(60),
        x + w,
        y + h + sw(36),
      );
      podium.addColorStop(0, "rgba(255,255,255,0.08)");
      podium.addColorStop(1, "rgba(0,0,0,0.42)");
      ctx.fillStyle = podium;
      roundRect(ctx, x - sw(26), y + h - sw(24), w + sw(52), sw(58), sw(16));
      ctx.fill();

      // side wall
      const side = ctx.createLinearGradient(x + w, y, x + w + depth, y - lift);
      side.addColorStop(0, building.side);
      side.addColorStop(1, "#050914");
      ctx.fillStyle = side;
      ctx.beginPath();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + depth, y - lift);
      ctx.lineTo(x + w + depth, y + h - lift);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.fill();

      // roof
      const roof = ctx.createLinearGradient(x, y, x + w + depth, y - lift);
      roof.addColorStop(0, building.roof);
      roof.addColorStop(0.55, rgba(building.accent, 0.2));
      roof.addColorStop(1, "rgba(255,255,255,0.08)");
      ctx.fillStyle = roof;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + depth, y - lift);
      ctx.lineTo(x + w + depth, y - lift);
      ctx.lineTo(x + w, y);
      ctx.closePath();
      ctx.fill();

      // facade
      const face = ctx.createLinearGradient(x, y, x + w, y + h);
      face.addColorStop(0, building.color);
      face.addColorStop(
        0.42,
        rgba(building.accent, building.landmark ? 0.09 : 0.035),
      );
      face.addColorStop(1, "rgba(2,6,14,0.92)");
      ctx.fillStyle = face;
      roundRect(ctx, x, y, w, h, sw(22));
      ctx.fill();

      // facade vertical strips
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.lineWidth = sw(1);
      const stripCount = Math.max(3, Math.floor(building.w / 70));
      for (let s = 1; s < stripCount; s += 1) {
        ctx.beginPath();
        ctx.moveTo(x + (w * s) / stripCount, y + sw(26));
        ctx.lineTo(x + (w * s) / stripCount, y + h - sw(30));
        ctx.stroke();
      }

      ctx.strokeStyle = building.landmark
        ? rgba(building.accent, 0.84)
        : "rgba(255,255,255,0.12)";
      ctx.lineWidth = sw(building.landmark ? 3 : 1.4);
      ctx.shadowColor = building.landmark ? building.accent : "transparent";
      ctx.shadowBlur = building.landmark ? 26 : 0;
      ctx.stroke();
      ctx.shadowBlur = 0;

      const cols = Math.max(4, Math.floor(building.w / 46));
      const rows = Math.max(7, Math.floor(building.h / 48));
      const winW = Math.max(3, w / (cols * 4.1));
      const winH = Math.max(4, h / (rows * 5.0));
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const lit = (frame + index * 17 + row * 13 + col * 19) % 100 > 20;
          const color = floorMarks[(index + row + col) % floorMarks.length];
          ctx.fillStyle = lit ? rgba(color, 0.7) : "rgba(255,255,255,0.030)";
          roundRect(
            ctx,
            x + w * 0.14 + col * (w / cols),
            y + h * 0.16 + row * (h / rows),
            winW,
            winH,
            sw(3),
          );
          ctx.fill();
        }
      }

      // roof details
      ctx.fillStyle = "rgba(0,0,0,0.38)";
      roundRect(ctx, x + w * 0.58, y - lift * 0.72, w * 0.22, sw(24), sw(6));
      ctx.fill();
      if (building.landmark) {
        ctx.strokeStyle = rgba(building.accent, 0.65);
        ctx.lineWidth = sw(3);
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5 + depth * 0.4, y - lift);
        ctx.lineTo(x + w * 0.5 + depth * 0.4, y - lift - sw(120));
        ctx.stroke();
        const antennaGlow = ctx.createRadialGradient(
          x + w * 0.5 + depth * 0.4,
          y - lift - sw(120),
          0,
          x + w * 0.5 + depth * 0.4,
          y - lift - sw(120),
          sw(75),
        );
        antennaGlow.addColorStop(0, rgba(building.accent, 0.32));
        antennaGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = antennaGlow;
        ctx.fillRect(
          x + w * 0.5 + depth * 0.4 - sw(75),
          y - lift - sw(195),
          sw(150),
          sw(150),
        );
      }

      if (building.label) {
        ctx.fillStyle = "rgba(3,7,16,0.80)";
        roundRect(ctx, x + w * 0.09, y + h * 0.055, w * 0.82, sw(50), sw(15));
        ctx.fill();
        ctx.fillStyle = building.accent;
        ctx.font = `900 ${Math.max(10, sw(16))}px ui-sans-serif, system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(building.label, x + w / 2, y + h * 0.055 + sw(32));
      }
      ctx.restore();
    });
}

function drawDistrictLandmarks(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
) {
  const monuments = [
    { x: 1060, y: 7800, label: "START", color: "#f6f388" },
    { x: 5650, y: 6250, label: "PRODUCTS", color: "#7dd3fc" },
    { x: 8350, y: 5530, label: "ACCESS", color: "#a7f3d0" },
    { x: 12460, y: 4040, label: "INTELLIGENCE", color: "#34d399" },
    { x: 14180, y: 3420, label: "LEADERSHIP", color: "#fda4af" },
    { x: 17120, y: 2000, label: "FUTURE", color: "#c4b5fd" },
  ];

  monuments.forEach((item, index) => {
    const x = sx(item.x);
    const y = sy(item.y);
    ctx.save();
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 22 + Math.sin(frame / 18 + index) * 4;
    ctx.fillStyle = "rgba(3,7,16,0.76)";
    roundRect(ctx, x - sw(136), y - sw(31), sw(272), sw(62), sw(23));
    ctx.fill();
    ctx.strokeStyle = rgba(item.color, 0.7);
    ctx.lineWidth = sw(2);
    ctx.stroke();
    ctx.fillStyle = item.color;
    ctx.font = `900 ${Math.max(10, sw(15))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(item.label, x, y + sw(6));
    ctx.restore();
  });
}

function drawStoryPanels(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
  car: Point,
  nearestId?: string,
) {
  storyPanels.forEach((panel) => {
    const point = checkpoints.find(
      (checkpoint) => checkpoint.id === panel.checkpointId,
    );
    if (!point) return;
    const center = { x: panel.x + panel.w / 2, y: panel.y + panel.h / 2 };
    const dist = distance(car, center);
    const focus = clamp(1 - (dist - 560) / 1850, 0, 1);
    if (focus <= 0.02) return;
    const isNear = nearestId === point.id;
    const alpha = 0.2 + focus * 0.8;
    const x = sx(panel.x);
    const y = sy(panel.y);
    const w = sw(panel.w);
    const h = sw(panel.h);

    ctx.save();
    ctx.globalAlpha = alpha;
    // physical support and pedestal
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + sw(92), w * 0.55, sw(55), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(180,205,220,0.22)";
    ctx.fillRect(x + w * 0.16, y + h - sw(2), sw(10), sw(110));
    ctx.fillRect(x + w * 0.84, y + h - sw(2), sw(10), sw(110));

    ctx.shadowColor = panel.color;
    ctx.shadowBlur = isNear ? 42 : 20;
    const material = ctx.createLinearGradient(x, y, x + w, y + h);
    material.addColorStop(0, "rgba(7,13,26,0.96)");
    material.addColorStop(0.48, rgba(panel.color, 0.16));
    material.addColorStop(1, "rgba(7,13,26,0.86)");
    ctx.fillStyle = material;
    roundRect(ctx, x, y, w, h, sw(28));
    ctx.fill();

    ctx.strokeStyle = rgba(panel.color, isNear ? 0.96 : 0.58);
    ctx.lineWidth = sw(isNear ? 3.6 : 2.4);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // tempered glass reflection
    const shine = ctx.createLinearGradient(x, y, x + w, y);
    shine.addColorStop(0, "rgba(255,255,255,0)");
    shine.addColorStop(0.28, "rgba(255,255,255,0.10)");
    shine.addColorStop(0.52, "rgba(255,255,255,0.02)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    roundRect(ctx, x + sw(8), y + sw(8), w - sw(16), h * 0.45, sw(24));
    ctx.fill();

    const scanX = x + ((frame * 1.3) % Math.max(1, w));
    const scan = ctx.createLinearGradient(
      scanX - sw(110),
      y,
      scanX + sw(110),
      y,
    );
    scan.addColorStop(0, "rgba(255,255,255,0)");
    scan.addColorStop(0.5, rgba(panel.color, 0.08));
    scan.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = scan;
    roundRect(ctx, x, y, w, h, sw(28));
    ctx.fill();

    ctx.fillStyle = panel.color;
    ctx.font = `900 ${Math.max(11, sw(15))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "left";
    ctx.fillText(point.district.toUpperCase(), x + sw(44), y + sw(56));
    ctx.fillStyle = "rgba(255,255,255,0.98)";
    ctx.font = `900 ${Math.max(25, sw(38))}px ui-sans-serif, system-ui`;
    ctx.fillText(`${point.icon} ${point.title}`, x + sw(44), y + sw(113));
    ctx.font = `${Math.max(14, sw(20))}px ui-sans-serif, system-ui`;
    ctx.fillStyle = "rgba(255,255,255,0.76)";
    wrapLines(ctx, point.summary, w - sw(88), 2).forEach((line, index) =>
      ctx.fillText(line, x + sw(44), y + sw(160 + index * 31)),
    );

    ctx.font = `${Math.max(13, sw(17))}px ui-sans-serif, system-ui`;
    point.bullets.slice(0, 3).forEach((bullet, index) => {
      const bulletText = wrapLines(ctx, bullet, w - sw(120), 1)[0];
      ctx.fillStyle =
        index === 0 ? rgba(panel.color, 0.95) : "rgba(255,255,255,0.70)";
      ctx.fillText(`— ${bulletText}`, x + sw(48), y + sw(244 + index * 31));
    });

    if (point.metrics?.length) {
      let tagX = x + sw(44);
      ctx.font = `900 ${Math.max(11, sw(13))}px ui-sans-serif, system-ui`;
      point.metrics.slice(0, 4).forEach((metric) => {
        const tagW = Math.max(sw(92), ctx.measureText(metric).width + sw(32));
        ctx.fillStyle = rgba(panel.color, 0.16);
        roundRect(ctx, tagX, y + h - sw(54), tagW, sw(32), sw(16));
        ctx.fill();
        ctx.fillStyle = panel.color;
        ctx.fillText(metric, tagX + sw(16), y + h - sw(32));
        tagX += tagW + sw(12);
      });
    }
    ctx.restore();
  });
}

function drawRouteHints(
  ctx: CanvasRenderingContext2D,
  sx: (x: number) => number,
  sy: (y: number) => number,
  sw: (value: number) => number,
  frame: number,
) {
  const arrows = [
    { x: 1650, y: 7820, angle: 0, label: "keep cruising" },
    { x: 4200, y: 6680, angle: -0.44, label: "product skyline" },
    { x: 7400, y: 5940, angle: -0.3, label: "research gardens" },
    { x: 11040, y: 4520, angle: -0.32, label: "digital shelf lane" },
    { x: 14020, y: 3420, angle: -0.42, label: "civic plaza" },
    { x: 16450, y: 2300, angle: -0.35, label: "future harbor" },
  ];
  arrows.forEach((arrow, index) => {
    const x = sx(arrow.x + Math.sin(frame / 22 + index) * 6);
    const y = sy(arrow.y);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(arrow.angle);
    ctx.fillStyle = "rgba(246,243,136,0.55)";
    ctx.beginPath();
    ctx.moveTo(sw(62), 0);
    ctx.lineTo(-sw(44), -sw(25));
    ctx.lineTo(-sw(15), 0);
    ctx.lineTo(-sw(44), sw(25));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.34)";
    ctx.font = `${Math.max(9, sw(12))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(arrow.label, sx(arrow.x), sy(arrow.y + 76));
    ctx.restore();
  });
}

function drawHeroCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number,
  frame: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const headlight = ctx.createLinearGradient(34 * scale, 0, 410 * scale, 0);
  headlight.addColorStop(0, "rgba(246,243,136,0.32)");
  headlight.addColorStop(0.45, "rgba(246,243,136,0.12)");
  headlight.addColorStop(1, "rgba(246,243,136,0)");
  ctx.fillStyle = headlight;
  ctx.beginPath();
  ctx.moveTo(30 * scale, -18 * scale);
  ctx.lineTo(410 * scale, -88 * scale);
  ctx.lineTo(410 * scale, 88 * scale);
  ctx.lineTo(30 * scale, 18 * scale);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.50)";
  ctx.beginPath();
  ctx.ellipse(0, 13 * scale, 62 * scale, 34 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createLinearGradient(
    -56 * scale,
    -32 * scale,
    58 * scale,
    32 * scale,
  );
  body.addColorStop(0, "#f6f388");
  body.addColorStop(0.42, "#fffbe4");
  body.addColorStop(1, "#67e8f9");
  ctx.shadowColor = "rgba(246,243,136,0.42)";
  ctx.shadowBlur = 22;
  ctx.fillStyle = body;
  roundRect(ctx, -52 * scale, -28 * scale, 104 * scale, 56 * scale, 17 * scale);
  ctx.fill();
  ctx.shadowBlur = 0;

  // hood and roof glass
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  roundRect(ctx, 16 * scale, -18 * scale, 24 * scale, 36 * scale, 8 * scale);
  ctx.fill();
  ctx.fillStyle = "rgba(3,9,18,0.84)";
  roundRect(ctx, -16 * scale, -18 * scale, 36 * scale, 36 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = "rgba(125,211,252,0.28)";
  roundRect(ctx, -11 * scale, -14 * scale, 25 * scale, 28 * scale, 8 * scale);
  ctx.fill();

  // wheels
  ctx.fillStyle = "rgba(0,0,0,0.88)";
  roundRect(ctx, -38 * scale, -34 * scale, 20 * scale, 10 * scale, 4 * scale);
  ctx.fill();
  roundRect(ctx, -38 * scale, 24 * scale, 20 * scale, 10 * scale, 4 * scale);
  ctx.fill();
  roundRect(ctx, 22 * scale, -34 * scale, 20 * scale, 10 * scale, 4 * scale);
  ctx.fill();
  roundRect(ctx, 22 * scale, 24 * scale, 20 * scale, 10 * scale, 4 * scale);
  ctx.fill();

  // lights
  ctx.fillStyle =
    frame % 18 < 9 ? "rgba(255,255,255,0.96)" : "rgba(246,243,136,0.92)";
  ctx.fillRect(47 * scale, -16 * scale, 5 * scale, 10 * scale);
  ctx.fillRect(47 * scale, 6 * scale, 5 * scale, 10 * scale);
  ctx.fillStyle = "rgba(255,60,60,0.82)";
  ctx.fillRect(-54 * scale, -13 * scale, 5 * scale, 9 * scale);
  ctx.fillRect(-54 * scale, 4 * scale, 5 * scale, 9 * scale);
  ctx.restore();
}

function drawHudCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  speed: number,
  nearest: Checkpoint | null,
  autoTour: boolean,
  cinematic: boolean,
  parkedZone: ParkingZone | null,
) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.textAlign = "left";
  ctx.fillText(`Speed ${Math.round(Math.abs(speed))}`, 24, height - 30);
  ctx.textAlign = "center";
  ctx.fillStyle = parkedZone ? parkedZone.color : "rgba(255,255,255,0.32)";
  ctx.fillText(
    parkedZone
      ? `Parked at ${parkedZone.title}`
      : `${autoTour ? "Guided drive" : "Manual drive"} · ${cinematic ? "cinematic camera" : "wide camera"} · ${profile.name}`,
    width / 2,
    height - 30,
  );
  if (nearest) {
    ctx.fillStyle = parkedZone ? parkedZone.color : "rgba(246,243,136,0.86)";
    ctx.textAlign = "right";
    ctx.fillText(
      parkedZone ? "Parking unlocked" : `Roadside chapter: ${nearest.title}`,
      width - 24,
      height - 30,
    );
  }
  ctx.restore();
}
