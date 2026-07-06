"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Html, Sparkles, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];
type BuildingKind = "origin" | "madestic" | "access" | "unilever" | "leadership" | "future";

type CityBuilding = {
  id: string;
  title: string;
  subtitle: string;
  district: string;
  kind: BuildingKind;
  position: Vec3;
  size: Vec3;
  rotation?: number;
  parking: { position: Vec3; size: [number, number]; rotation?: number };
  details: { role: string; stack: string[]; story: string; impact: string[] };
};

type PuzzleZone = {
  id: string;
  title: string;
  position: Vec3;
  size: [number, number];
  rotation?: number;
  question: string;
  options: string[];
  answer: number;
  reward: string;
};

type ActiveZone = { type: "building"; id: string } | { type: "puzzle"; id: string } | null;

const districtColors: Record<BuildingKind, string> = {
  origin: "#f6f388",
  madestic: "#7dd3fc",
  access: "#a7f3d0",
  unilever: "#34d399",
  leadership: "#fda4af",
  future: "#c4b5fd"
};

const loop = {
  left: -42,
  right: 162,
  top: 42,
  bottom: -62,
  roadWidth: 14
};

const roadSegments = [
  { id: "north-loop", label: "Origin + mADestic Boulevard", position: [60, 0.02, 42] as Vec3, size: [204, 0.12, 14] as Vec3, dir: "x" as const },
  { id: "east-loop", label: "Accessibility Avenue", position: [162, 0.021, -10] as Vec3, size: [14, 0.12, 104] as Vec3, dir: "z" as const },
  { id: "south-loop", label: "Supply Chain + Leadership Boulevard", position: [60, 0.022, -62] as Vec3, size: [204, 0.12, 14] as Vec3, dir: "x" as const },
  { id: "west-loop", label: "Future Return Road", position: [-42, 0.023, -10] as Vec3, size: [14, 0.12, 104] as Vec3, dir: "z" as const },
  { id: "central-connector", label: "Case Study Connector", position: [60, 0.024, -10] as Vec3, size: [130, 0.12, 10] as Vec3, dir: "x" as const },
  { id: "center-spine", label: "Innovation Spine", position: [60, 0.025, -10] as Vec3, size: [10, 0.12, 68] as Vec3, dir: "z" as const }
];

const intersections: Vec3[] = [
  [loop.left, 0.05, loop.top],
  [loop.right, 0.05, loop.top],
  [loop.right, 0.05, loop.bottom],
  [loop.left, 0.05, loop.bottom],
  [60, 0.05, 42],
  [60, 0.05, -62],
  [60, 0.05, -10]
];

const buildings: CityBuilding[] = [
  {
    id: "origin-iut",
    title: "IUT Origin Tower",
    subtitle: "CSE foundation",
    district: "Origin Gate",
    kind: "origin",
    position: [-26, 0, 62],
    size: [10, 22, 10],
    parking: { position: [-26, 0.07, 51], size: [8, 6] },
    details: {
      role: "CSE undergraduate at Islamic University of Technology.",
      stack: ["Algorithms", "Systems", "Software Engineering", "HCI"],
      story: "This is where the technical base of the city starts: programming, theory, product thinking, and the habit of turning confusing problems into structured systems.",
      impact: ["Built strong systems-thinking foundation.", "Connected software engineering with real product operations.", "Prepared the base for ERP, HCI, and automation projects."]
    }
  },
  {
    id: "origin-systems",
    title: "Systems Mindset Hall",
    subtitle: "chaos → workflow",
    district: "Origin Gate",
    kind: "origin",
    position: [0, 0, 62],
    size: [12, 16, 10],
    parking: { position: [0, 0.07, 51], size: [8, 6] },
    details: {
      role: "Builder, operator, and workflow thinker.",
      stack: ["Operations", "QA", "Automation", "Product Design"],
      story: "The core pattern: enter a messy workflow, find the hidden rules, create the system, and make the team move faster with less confusion.",
      impact: ["Maps unclear business flows.", "Designs systems around edge cases.", "Balances code, users, operations, and business reality."]
    }
  },
  {
    id: "madestic-hq",
    title: "mADestic HQ",
    subtitle: "digital operations",
    district: "mADestic Downtown",
    kind: "madestic",
    position: [32, 0, 62],
    size: [13, 30, 12],
    parking: { position: [32, 0.07, 51], size: [8, 6] },
    details: {
      role: "Co-Founder & COO at mADestic Digital.",
      stack: ["Product Ops", "Delivery", "Team Management", "ERP"],
      story: "The company-building tower: managing projects, translating client pain into product logic, and keeping delivery moving without losing operational truth.",
      impact: ["Turned business requirements into buildable modules.", "Coordinated dev/product/ops decisions.", "Created a home for ERP and automation work."]
    }
  },
  {
    id: "errum",
    title: "Errum ERP Tower",
    subtitle: "retail ERP",
    district: "mADestic Downtown",
    kind: "madestic",
    position: [56, 0, 64],
    size: [14, 38, 13],
    parking: { position: [56, 0.07, 51], size: [8, 6] },
    details: {
      role: "Product operations, workflow design, QA thinking, architecture direction.",
      stack: ["Laravel", "Next.js", "MySQL", "POS", "Inventory", "Accounting"],
      story: "Errum is the skyscraper for real retail chaos: stock, barcodes, POS, social commerce, dispatch, returns, accounting, branch logic, and reports.",
      impact: ["Unified sales, stock, dispatch, return, and accounting flows.", "Reduced confusion around barcode availability and branch assignment.", "Created a base for deeper automation and business intelligence."]
    }
  },
  {
    id: "deshio",
    title: "Deshio Systems Plaza",
    subtitle: "custom ERP backbone",
    district: "mADestic Downtown",
    kind: "madestic",
    position: [82, 0, 62],
    size: [13, 28, 12],
    parking: { position: [82, 0.07, 51], size: [8, 6] },
    details: {
      role: "System planner and product workflow owner.",
      stack: ["Laravel", "Next.js", "RBAC", "Inventory", "Sales", "Reports"],
      story: "Deshio represents the from-scratch ERP direction: catalog, inventory, order assignment, reservations, stores, customers, accounting, and reporting.",
      impact: ["Moved from generic tools to brand-specific ERP logic.", "Clarified assignment and reservation policy.", "Created test workflows for edge cases like returns and one-stock cases."]
    }
  },
  {
    id: "sarengmed",
    title: "SarengMed Lab",
    subtitle: "medical equipment site",
    district: "mADestic Downtown",
    kind: "madestic",
    position: [108, 0, 62],
    size: [11, 21, 10],
    parking: { position: [108, 0.07, 51], size: [8, 6] },
    details: {
      role: "Product delivery and digital business support.",
      stack: ["Web", "B2B", "Medical Equipment", "Lead Flow"],
      story: "A compact glass lab for healthcare-facing digital work: product presentation, business outreach, and operation-ready web systems.",
      impact: ["Supported B2B medical equipment communication.", "Connected product detail with digital lead flow.", "Expanded mADestic's project range."]
    }
  },
  {
    id: "websystems",
    title: "Web Systems Arcade",
    subtitle: "websites + tools",
    district: "mADestic Downtown",
    kind: "madestic",
    position: [134, 0, 62],
    size: [11, 18, 10],
    parking: { position: [134, 0.07, 51], size: [8, 6] },
    details: {
      role: "Web product direction and delivery support.",
      stack: ["Next.js", "Tailwind", "Admin Panels", "Automation"],
      story: "This arcade stores the smaller but important web systems: portals, dashboards, experiments, admin panels, and interactive frontend experiences.",
      impact: ["Faster client-facing product creation.", "Reusable UI and admin patterns.", "More polished product storytelling."]
    }
  },
  {
    id: "okkhi",
    title: "Okkhi Research Lab",
    subtitle: "blind-first HCI",
    district: "Blind-First Innovation Zone",
    kind: "access",
    position: [186, 0, 32],
    size: [14, 18, 12],
    parking: { position: [154, 0.07, 32], size: [8, 6] , rotation: Math.PI / 2},
    details: {
      role: "Research lab concept owner.",
      stack: ["Blind HCI", "Field Study", "Assistive Tech", "Research Ops"],
      story: "Okkhi is the calm, glowing lab district for blind computer interaction, blind AI interaction, hardware, and curriculum work.",
      impact: ["Created direction for a Bangladesh-first accessibility lab.", "Connected product experiments with field research.", "Focused on dignity, usability, and practical adoption."]
    }
  },
  {
    id: "abcd",
    title: "ABCD Braille Trainer",
    subtitle: "voice-first learning",
    district: "Blind-First Innovation Zone",
    kind: "access",
    position: [186, 0, 8],
    size: [13, 28, 12],
    parking: { position: [154, 0.07, 10], size: [8, 6] , rotation: Math.PI / 2},
    details: {
      role: "HCI concept owner and accessibility workflow designer.",
      stack: ["Next.js", "FastAPI", "Electron", "Arduino", "Gamepad", "Voice UX"],
      story: "A blind-first learning tower where keyboard, voice, and hardware combine to teach English Braille with clear Bangla guidance.",
      impact: ["Created a voice-guided Braille literacy concept.", "Designed gamepad and custom keyboard interactions.", "Prepared a base for classroom and hardware expansion."]
    }
  },
  {
    id: "srobon",
    title: "Srobon Reader Dome",
    subtitle: "blind PDF reader",
    district: "Blind-First Innovation Zone",
    kind: "access",
    position: [186, 0, -16],
    size: [14, 21, 13],
    parking: { position: [154, 0.07, -12], size: [8, 6] , rotation: Math.PI / 2},
    details: {
      role: "Blind-first document interaction planner.",
      stack: ["Python", "OCR", "TTS", "Gamepad Navigation", "Bangla"],
      story: "Srobon is a reader built around listening, chapters, movement, and control without needing a screen-first workflow.",
      impact: ["Designed granular audio reading flow.", "Focused on chapter navigation for PDFs.", "Extended blind-first app thinking beyond training."]
    }
  },
  {
    id: "voiceux",
    title: "Voice UX Studio",
    subtitle: "sound as interface",
    district: "Blind-First Innovation Zone",
    kind: "access",
    position: [186, 0, -40],
    size: [11, 18, 10],
    parking: { position: [154, 0.07, -34], size: [8, 6] , rotation: Math.PI / 2},
    details: {
      role: "Voice assistance interaction designer.",
      stack: ["Audio Cues", "WAV Pipeline", "Bangla Prompts", "Controller UX"],
      story: "A studio for the lesson learned from blind-first products: the voice is not decoration, it is the actual interface.",
      impact: ["Created prompt systems for low-vision/no-vision use.", "Reduced dependence on visual menus.", "Improved confidence and feedback loops."]
    }
  },
  {
    id: "unilever",
    title: "Unilever Business Tower",
    subtitle: "BizLearner lane",
    district: "Unilever Supply Chain Lane",
    kind: "unilever",
    position: [150, 0, -88],
    size: [13, 32, 12],
    parking: { position: [150, 0.07, -74], size: [8, 6] },
    details: {
      role: "BizLearner at Unilever Bangladesh.",
      stack: ["Supply Chain", "Digital Shelf", "Operations", "Reporting"],
      story: "The corporate glass tower for learning how real FMCG operations, availability, and marketplace reporting work at scale.",
      impact: ["Connected software thinking with supply chain reality.", "Worked around daily reporting discipline.", "Strengthened business/operations judgment."]
    }
  },
  {
    id: "shelf",
    title: "Digital Shelf Center",
    subtitle: "marketplace intelligence",
    district: "Unilever Supply Chain Lane",
    kind: "unilever",
    position: [124, 0, -88],
    size: [13, 27, 12],
    parking: { position: [124, 0.07, -74], size: [8, 6] },
    details: {
      role: "Reporting workflow owner and automation planner.",
      stack: ["Python", "Excel Automation", "SKU Mapping", "Marketplaces"],
      story: "This center represents the Arogga/Daraz/Othoba/Pandamart/Shajgoj/Shwapno/UShopBD reporting workflow and the move from manual repair to repeatable ingestion.",
      impact: ["Unified fragmented daily account outputs.", "Reduced manual report repair.", "Built a foundation for digital shelf intelligence."]
    }
  },
  {
    id: "ola",
    title: "OLA Observatory",
    subtitle: "availability logic",
    district: "Unilever Supply Chain Lane",
    kind: "unilever",
    position: [98, 0, -88],
    size: [12, 24, 12],
    parking: { position: [98, 0.07, -74], size: [8, 6] },
    details: {
      role: "Availability and reporting logic planner.",
      stack: ["OLA", "NOLA", "CPP", "SKU Decisions", "Dashboards"],
      story: "A data observatory for measuring whether products are visible, priced correctly, and available across digital shelf channels.",
      impact: ["Improved clarity around SKU-level availability.", "Prepared account-wise reporting structure.", "Turned daily files into decision-ready outputs."]
    }
  },
  {
    id: "mapping",
    title: "SKU Mapping Bank",
    subtitle: "data backbone",
    district: "Unilever Supply Chain Lane",
    kind: "unilever",
    position: [72, 0, -88],
    size: [11, 21, 11],
    parking: { position: [72, 0.07, -74], size: [8, 6] },
    details: {
      role: "Data normalization and mapping workflow thinker.",
      stack: ["SKU Codes", "Product IDs", "Master Mapping", "Excel"],
      story: "The quiet backbone: if product names, IDs, branches, formats, and expected prices do not map cleanly, the whole report breaks.",
      impact: ["Reduced mismatch risk across accounts.", "Built cleaner ingestion assumptions.", "Created repeatable mapping discipline."]
    }
  },
  {
    id: "rofs",
    title: "ROFS Civic Hall",
    subtitle: "leadership",
    district: "Leadership Square",
    kind: "leadership",
    position: [46, 0, -88],
    size: [13, 22, 12],
    parking: { position: [46, 0.07, -74], size: [8, 6] },
    details: {
      role: "General Secretary at ROFS.",
      stack: ["Coordination", "Communication", "Events", "Execution"],
      story: "A civic hall for organizing people, managing responsibilities, and moving from discussion to execution.",
      impact: ["Led team communication and operational coordination.", "Handled planning around people and events.", "Built leadership through service and responsibility."]
    }
  },
  {
    id: "rbc",
    title: "Project RBC Arena",
    subtitle: "project direction",
    district: "Leadership Square",
    kind: "leadership",
    position: [20, 0, -88],
    size: [15, 20, 13],
    parking: { position: [20, 0.07, -74], size: [8, 6] },
    details: {
      role: "Project Director at Project RBC.",
      stack: ["Project Planning", "Team Execution", "Stakeholders", "Operations"],
      story: "The arena represents taking ownership when many moving parts need to become one organized project.",
      impact: ["Turned ambiguity into structured work.", "Coordinated people around outcomes.", "Practiced high-pressure execution."]
    }
  },
  {
    id: "positive-one",
    title: "The Positive One Media House",
    subtitle: "youth platform",
    district: "Leadership Square",
    kind: "leadership",
    position: [-6, 0, -88],
    size: [13, 24, 12],
    parking: { position: [-6, 0.07, -74], size: [8, 6] },
    details: {
      role: "Co-founder, community builder, content and operations lead.",
      stack: ["Community", "Publishing", "Brand", "Web Ops"],
      story: "A media house for youth-centered positive storytelling, digital presence, and community energy.",
      impact: ["Built a recognizable social presence.", "Created digital operations around content.", "Supported positive storytelling and youth engagement."]
    }
  },
  {
    id: "agentic-ai",
    title: "Agentic AI Terminal",
    subtitle: "future systems",
    district: "Future Highway",
    kind: "future",
    position: [-70, 0, -38],
    size: [13, 28, 12],
    parking: { position: [-54, 0.07, -38], size: [8, 6] , rotation: Math.PI / 2},
    details: {
      role: "Future direction: AI agents for operations and workflow automation.",
      stack: ["Agents", "Automation", "Workflows", "Human-in-the-loop"],
      story: "The terminal is for the next build direction: software that does not just store data, but helps people execute work intelligently.",
      impact: ["Moves ERPs toward assistant-driven operations.", "Connects product workflows with AI reasoning.", "Frames a long-term builder identity."]
    }
  },
  {
    id: "hci-lab",
    title: "HCI Future Lab",
    subtitle: "human-centered systems",
    district: "Future Highway",
    kind: "future",
    position: [-70, 0, -16],
    size: [14, 23, 12],
    parking: { position: [-54, 0.07, -16], size: [8, 6] , rotation: Math.PI / 2},
    details: {
      role: "Future research direction in HCI and accessible systems.",
      stack: ["HCI", "Usability", "Accessibility", "Research"],
      story: "The future lab connects the technical city with the human one: interfaces, usability, blind-first systems, and practical adoption.",
      impact: ["Keeps human experience at the center of software.", "Connects academic research with product reality.", "Supports a Japan/MEXT research path."]
    }
  },
  {
    id: "japan",
    title: "Japan Research Gate",
    subtitle: "MEXT horizon",
    district: "Future Highway",
    kind: "future",
    position: [-70, 0, 6],
    size: [13, 30, 12],
    parking: { position: [-54, 0.07, 6], size: [8, 6] , rotation: Math.PI / 2},
    details: {
      role: "Future academic/research pathway.",
      stack: ["Research Proposal", "HCI", "Software Systems", "Japan"],
      story: "A gate at the edge of the city for the next chapter: research, graduate study, and building human-centered systems at a deeper level.",
      impact: ["Clarifies long-term direction.", "Frames portfolio as builder + researcher.", "Shows ambition beyond ordinary software delivery."]
    }
  }
];

const puzzleZones: PuzzleZone[] = [
  {
    id: "puzzle-flow",
    title: "Workflow Puzzle Bay",
    position: [150, 0.08, 51],
    size: [9, 6],
    question: "An ERP order has stock scanned but status fell back. What should the system check first?",
    options: ["Color theme", "Barcode reservation + order state", "Logo size"],
    answer: 1,
    reward: "Correct. In this city, beautiful UI only matters after operational truth is protected."
  },
  {
    id: "puzzle-access",
    title: "Accessibility Puzzle Bay",
    position: [172, 0.08, -52],
    size: [9, 6],
    rotation: Math.PI / 2,
    question: "For blind-first software, which one is the interface, not just decoration?",
    options: ["Voice feedback", "Hover animation", "Tiny sidebar"],
    answer: 0,
    reward: "Correct. Voice, timing, and control feedback are the real screen."
  },
  {
    id: "puzzle-data",
    title: "Data Puzzle Bay",
    position: [-54, 0.08, -52],
    size: [9, 6],
    rotation: Math.PI / 2,
    question: "If marketplace product names differ daily, what keeps reports reliable?",
    options: ["More colors", "Manual guessing", "Master SKU mapping"],
    answer: 2,
    reward: "Correct. Mapping is the silent infrastructure of reporting."
  }
];

function inRotatedZone(point: THREE.Vector3, zone: { position: Vec3; size: [number, number]; rotation?: number }) {
  const [w, d] = zone.size;
  const rot = zone.rotation ?? 0;
  const dx = point.x - zone.position[0];
  const dz = point.z - zone.position[2];
  const c = Math.cos(-rot);
  const s = Math.sin(-rot);
  const rx = dx * c - dz * s;
  const rz = dx * s + dz * c;
  return Math.abs(rx) < w / 2 && Math.abs(rz) < d / 2;
}

function MueedCity3D() {
  const [activeZone, setActiveZone] = useState<ActiveZone>(null);
  const [cameraMode, setCameraMode] = useState<"cinematic" | "driver" | "wide">("cinematic");
  const [miniMapOpen, setMiniMapOpen] = useState(false);
  const [experienceStarted, setExperienceStarted] = useState(false);
  const activeBuilding = activeZone?.type === "building" ? buildings.find((b) => b.id === activeZone.id) : undefined;
  const activePuzzle = activeZone?.type === "puzzle" ? puzzleZones.find((p) => p.id === activeZone.id) : undefined;

  return (
    <section id="drive" className="city-shell relative h-screen min-h-[760px] overflow-hidden bg-[#02050a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_12%,rgba(125,211,252,.20),transparent_32%),radial-gradient(circle_at_84%_0%,rgba(246,243,136,.09),transparent_28%),radial-gradient(circle_at_72%_88%,rgba(167,139,250,.12),transparent_30%),linear-gradient(180deg,#02040a_0%,#061120_42%,#02040a_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:96px_96px] opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black/76 to-transparent" />

      <Canvas className="absolute inset-0 h-full w-full" shadows dpr={[1, 1.8]} camera={{ position: [-58, 28, 72], fov: 45, near: 0.1, far: 700 }}>
        <Suspense fallback={null}>
          <CityScene cameraMode={cameraMode} onActiveZone={setActiveZone} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-24 z-20 md:left-8 md:top-28">
        <div className={`max-w-[460px] rounded-[2rem] border border-white/12 bg-[#030711]/55 p-5 shadow-[0_30px_120px_rgba(0,0,0,.62)] backdrop-blur-2xl transition-all duration-500 ${experienceStarted ? "scale-95 opacity-90 md:max-w-[330px]" : ""}`}>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-9 bg-[#f6f388]" />
            <span className="text-[11px] font-black uppercase tracking-[0.34em] text-[#f6f388]">Phase 6.7 · fixed start + left lane</span>
          </div>
          <h1 className={`${experienceStarted ? "text-xl md:text-2xl" : "text-4xl md:text-6xl"} font-black leading-[.96] tracking-[-0.05em] text-white transition-all`}>
            Drive the clean left-lane loop.
          </h1>
          {!experienceStarted && <p className="mt-5 max-w-md text-base leading-8 text-white/72 md:text-lg">A corrected Bangladesh-style portfolio city: the lap starts on the left lane, the start gate stays out of the camera, and every story stop sits on the driver’s left side.</p>}
          {experienceStarted && <p className="mt-3 text-sm leading-6 text-white/62">Fixed start: car begins in the visible left lane, signs face the audience, and parking sits on the driver’s left.</p>}
          <div className="pointer-events-auto mt-5 flex flex-wrap gap-2">
            {!experienceStarted && (
              <button onClick={() => setExperienceStarted(true)} className="rounded-full bg-[#f6f388] px-5 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(246,243,136,.35)] transition hover:scale-[1.03]">Start lap</button>
            )}
            {(["cinematic", "driver", "wide"] as const).map((mode) => (
              <button key={mode} onClick={() => { setExperienceStarted(true); setCameraMode(mode); }} className={`rounded-full border px-4 py-2.5 text-xs font-black capitalize transition ${cameraMode === mode ? "border-[#f6f388] bg-[#f6f388] text-black" : "border-white/12 bg-white/[0.055] text-white/72 hover:border-white/25 hover:bg-white/10 hover:text-white"}`}>{mode}</button>
            ))}
            <button onClick={() => setMiniMapOpen((v) => !v)} className="rounded-full border border-white/12 bg-white/[0.055] px-4 py-2.5 text-xs font-black text-white/72 transition hover:border-white/25 hover:bg-white/10 hover:text-white">{miniMapOpen ? "Hide map" : "Map"}</button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 z-20 hidden w-[330px] rounded-[1.7rem] border border-white/10 bg-[#030711]/55 p-4 shadow-[0_25px_90px_rgba(0,0,0,.5)] backdrop-blur-2xl lg:block">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">Driver brief</div>
            <div className="mt-1 text-sm font-black text-white">WASD / Arrow keys</div>
          </div>
          <div className="rounded-full border border-[#f6f388]/25 bg-[#f6f388]/10 px-3 py-1 text-[10px] font-black text-[#f6f388]">LEFT DRIVE</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-white/62">
          <div className="rounded-2xl border border-white/8 bg-white/[0.045] p-3"><b className="block text-white">Left lane</b>Bangladesh-style driving</div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.045] p-3"><b className="block text-white">Park</b>Stop in a glowing bay</div>
        </div>
      </div>

      {miniMapOpen && <MiniMap activeZone={activeZone} />}
      {(activeBuilding || activePuzzle) && <InteractionPanel building={activeBuilding} puzzle={activePuzzle} onClose={() => setActiveZone(null)} />}
      <MobileControls />
    </section>
  );
}

function CityScene({ cameraMode, onActiveZone }: { cameraMode: "cinematic" | "driver" | "wide"; onActiveZone: (zone: ActiveZone) => void }) {
  const carRef = useRef<THREE.Group>(null);
  const carState = useRef({ speed: 0 });
  const activeRef = useRef<string | null>(null);
  return (
    <>
      <color attach="background" args={["#02050a"]} />
      <fog attach="fog" args={["#06111f", 40, 285]} />
      <ambientLight intensity={0.36} />
      <hemisphereLight intensity={0.76} groundColor="#05070d" color="#c7e6ff" />
      <directionalLight castShadow position={[-40, 70, 48]} intensity={1.55} shadow-mapSize={[2048, 2048]} shadow-camera-left={-160} shadow-camera-right={220} shadow-camera-top={140} shadow-camera-bottom={-140} />
      <pointLight position={[40, 25, 54]} intensity={2.2} color="#7dd3fc" distance={112} />
      <pointLight position={[176, 20, -8]} intensity={1.8} color="#a7f3d0" distance={100} />
      <pointLight position={[-60, 22, -20]} intensity={2.1} color="#c4b5fd" distance={105} />
      <Stars radius={190} depth={82} count={1500} factor={4.2} fade speed={0.2} />
      <Sparkles count={90} scale={[230, 18, 140]} size={1.15} speed={0.14} opacity={0.22} color="#e0f2fe" />
      <CityGround />
      <SkylineBackdrop />
      <RoadNetwork />
      <LoopMonuments />
      <DistrictAtmosphere />
      {buildings.map((building) => <Building key={building.id} building={building} />)}
      {buildings.map((building) => <ParkingBay key={`${building.id}-parking`} building={building} />)}
      {puzzleZones.map((zone) => <PuzzleParkingBay key={zone.id} zone={zone} />)}
      <TrafficSystem />
      <WorldStorySigns />
      <CarController carRef={carRef} carState={carState} activeRef={activeRef} onActiveZone={onActiveZone} />
      <ContactShadows position={[60, 0.025, -10]} opacity={0.34} scale={260} blur={2.9} far={50} />
      <CameraRig carRef={carRef} cameraMode={cameraMode} />
    </>
  );
}

function CityGround() {
  const treePositions = useMemo(() => Array.from({ length: 110 }).map((_, i) => {
    const x = -86 + ((i * 31) % 288);
    const z = -104 + ((i * 47) % 190);
    const nearLoop = (Math.abs(z - loop.top) < 11 && x > loop.left - 10 && x < loop.right + 10) || (Math.abs(z - loop.bottom) < 11 && x > loop.left - 10 && x < loop.right + 10) || (Math.abs(x - loop.left) < 11 && z > loop.bottom - 10 && z < loop.top + 10) || (Math.abs(x - loop.right) < 11 && z > loop.bottom - 10 && z < loop.top + 10);
    return { x, z, show: !nearLoop || i % 5 === 0, scale: 0.32 + ((i * 13) % 9) / 13 };
  }), []);

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[60, -0.06, -10]}>
        <planeGeometry args={[310, 220, 1, 1]} />
        <meshStandardMaterial color="#08101a" roughness={0.98} metalness={0.02} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[132, 0.002, -95]}>
        <planeGeometry args={[120, 40]} />
        <meshStandardMaterial color="#06253a" roughness={0.72} metalness={0.12} emissive="#07233a" emissiveIntensity={0.32} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[132, 0.018, -75]}>
        <planeGeometry args={[120, 1.4]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.28} />
      </mesh>
      <CityPark position={[-70, 0.01, 45]} size={[34, 28]} color="#23331f" />
      <CityPark position={[21, 0.01, 15]} size={[36, 24]} color="#123c32" />
      <CityPark position={[130, 0.01, -22]} size={[32, 26]} color="#193d35" />
      <CityPark position={[-22, 0.01, -34]} size={[30, 28]} color="#2a1927" />
      {treePositions.map((t, i) => t.show ? <Tree key={i} position={[t.x, 0, t.z]} scale={t.scale} /> : null)}
    </group>
  );
}

function CityPark({ position, size, color }: { position: Vec3; size: [number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh receiveShadow><boxGeometry args={[size[0], 0.05, size[1]]} /><meshStandardMaterial color={color} roughness={0.82} metalness={0.04} emissive={color} emissiveIntensity={0.12} /></mesh>
      <mesh position={[0, 0.045, 0]}><boxGeometry args={[size[0] - 1, 0.018, size[1] - 1]} /><meshBasicMaterial color="#a7f3d0" transparent opacity={0.035} /></mesh>
    </group>
  );
}

function SkylineBackdrop() {
  const towers = useMemo(() => Array.from({ length: 55 }).map((_, i) => ({
    x: -88 + i * 5.8,
    z: -112 - (i % 5) * 2.6,
    w: 3.4 + (i % 4),
    h: 12 + ((i * 11) % 32),
    d: 3.4 + (i % 3),
    color: i % 3 === 0 ? "#101827" : i % 3 === 1 ? "#0c1625" : "#111827"
  })), []);
  return (
    <group>
      {towers.map((tower, i) => (
        <group key={i} position={[tower.x, 0, tower.z]}>
          <mesh position={[0, tower.h / 2, 0]}><boxGeometry args={[tower.w, tower.h, tower.d]} /><meshStandardMaterial color={tower.color} roughness={0.72} metalness={0.18} emissive="#07101f" emissiveIntensity={0.18} /></mesh>
          {Array.from({ length: Math.max(2, Math.floor(tower.h / 4)) }).map((_, r) => <mesh key={r} position={[0, 2.5 + r * 3.2, tower.d / 2 + 0.02]}><boxGeometry args={[tower.w * 0.62, 0.08, 0.04]} /><meshBasicMaterial color={i % 4 === 0 ? "#f6f388" : "#7dd3fc"} transparent opacity={0.18} /></mesh>)}
        </group>
      ))}
      <mesh position={[60, 10, -119]}><boxGeometry args={[330, 20, 1]} /><meshBasicMaterial color="#7dd3fc" transparent opacity={0.025} /></mesh>
    </group>
  );
}

function RoadNetwork() {
  return (
    <group>
      {roadSegments.map((road) => <Road key={road.id} position={road.position} size={road.size} />)}
      {intersections.map((p, i) => <Intersection key={i} position={p} />)}
      {roadSegments.map((road) => <LaneMarkers key={`${road.id}-lane`} position={road.position} size={road.size} />)}
      <LoopDirectionArrows />
      <CareerRoadLines />
      <BangladeshLeftDriveMarkers />
      {intersections.map((p, i) => <Crosswalks key={`cw-${i}`} position={p} />)}
      {roadSegments.map((road) => <Curbs key={`${road.id}-curbs`} position={road.position} size={road.size} />)}
      <StreetLampRibbon />
    </group>
  );
}

function Road({ position, size }: { position: Vec3; size: Vec3 }) {
  const isHorizontal = size[0] > size[2];
  const length = isHorizontal ? size[0] : size[2];
  const width = isHorizontal ? size[2] : size[0];
  const patchCount = Math.max(4, Math.floor(length / 18));
  return (
    <group position={position}>
      <mesh receiveShadow><boxGeometry args={size} /><meshStandardMaterial color="#0d121a" roughness={0.98} metalness={0.025} /></mesh>
      <mesh position={[0, 0.073, 0]}><boxGeometry args={[size[0] - 0.75, 0.012, size[2] - 0.75]} /><meshStandardMaterial color="#1d242d" roughness={0.96} metalness={0.035} transparent opacity={0.94} /></mesh>
      <mesh position={isHorizontal ? [0, 0.106, -0.36] : [-0.36, 0.106, 0]}><boxGeometry args={isHorizontal ? [length - 3.4, 0.014, 0.08] : [0.08, 0.014, length - 3.4]} /><meshBasicMaterial color="#f6f388" transparent opacity={0.5} /></mesh>
      <mesh position={isHorizontal ? [0, 0.106, 0.36] : [0.36, 0.106, 0]}><boxGeometry args={isHorizontal ? [length - 3.4, 0.014, 0.08] : [0.08, 0.014, length - 3.4]} /><meshBasicMaterial color="#f6f388" transparent opacity={0.5} /></mesh>
      <mesh position={isHorizontal ? [0, 0.101, -width / 2 + 1.1] : [-width / 2 + 1.1, 0.101, 0]}><boxGeometry args={isHorizontal ? [length - 2, 0.012, 0.08] : [0.08, 0.012, length - 2]} /><meshBasicMaterial color="#dbeafe" transparent opacity={0.42} /></mesh>
      <mesh position={isHorizontal ? [0, 0.101, width / 2 - 1.1] : [width / 2 - 1.1, 0.101, 0]}><boxGeometry args={isHorizontal ? [length - 2, 0.012, 0.08] : [0.08, 0.012, length - 2]} /><meshBasicMaterial color="#dbeafe" transparent opacity={0.42} /></mesh>
      {Array.from({ length: patchCount }).map((_, i) => { const offset = -length / 2 + 8 + i * 17; const side = i % 2 === 0 ? -1 : 1; return <mesh key={i} position={isHorizontal ? [offset, 0.109, side * 3.4] : [side * 3.4, 0.109, offset]}><boxGeometry args={isHorizontal ? [5.8, 0.01, 1.4] : [1.4, 0.01, 5.8]} /><meshBasicMaterial color="#000000" transparent opacity={0.08} /></mesh>; })}
    </group>
  );
}

function LaneMarkers({ position, size }: { position: Vec3; size: Vec3 }) {
  const isHorizontal = size[0] > size[2];
  const length = isHorizontal ? size[0] : size[2];
  const count = Math.floor(length / 9);
  return (
    <group position={[position[0], 0.126, position[2]]}>
      {Array.from({ length: count }).map((_, i) => { const offset = -((count - 1) * 9) / 2 + i * 9; if (Math.abs(offset) < 5) return null; return <group key={i}><mesh position={isHorizontal ? [offset, 0, -3.25] : [-3.25, 0, offset]}><boxGeometry args={isHorizontal ? [3.6, 0.01, 0.08] : [0.08, 0.01, 3.6]} /><meshBasicMaterial color="#cbd5e1" transparent opacity={0.5} /></mesh><mesh position={isHorizontal ? [offset, 0, 3.25] : [3.25, 0, offset]}><boxGeometry args={isHorizontal ? [3.6, 0.01, 0.08] : [0.08, 0.01, 3.6]} /><meshBasicMaterial color="#cbd5e1" transparent opacity={0.5} /></mesh></group>; })}
    </group>
  );
}

function Curbs({ position, size }: { position: Vec3; size: Vec3 }) {
  const isHorizontal = size[0] > size[2];
  return (
    <group position={[position[0], 0.14, position[2]]}>
      <mesh position={isHorizontal ? [0, 0, -size[2] / 2 - 0.55] : [-size[0] / 2 - 0.55, 0, 0]}><boxGeometry args={isHorizontal ? [size[0] + 1.2, 0.22, 0.42] : [0.42, 0.22, size[2] + 1.2]} /><meshStandardMaterial color="#798493" roughness={0.82} metalness={0.04} /></mesh>
      <mesh position={isHorizontal ? [0, 0, size[2] / 2 + 0.55] : [size[0] / 2 + 0.55, 0, 0]}><boxGeometry args={isHorizontal ? [size[0] + 1.2, 0.22, 0.42] : [0.42, 0.22, size[2] + 1.2]} /><meshStandardMaterial color="#798493" roughness={0.82} metalness={0.04} /></mesh>
      <mesh position={isHorizontal ? [0, 0.02, -size[2] / 2 - 0.86] : [-size[0] / 2 - 0.86, 0.02, 0]}><boxGeometry args={isHorizontal ? [size[0] + 1.2, 0.035, 0.08] : [0.08, 0.035, size[2] + 1.2]} /><meshBasicMaterial color="#38bdf8" transparent opacity={0.18} /></mesh>
      <mesh position={isHorizontal ? [0, 0.02, size[2] / 2 + 0.86] : [size[0] / 2 + 0.86, 0.02, 0]}><boxGeometry args={isHorizontal ? [size[0] + 1.2, 0.035, 0.08] : [0.08, 0.035, size[2] + 1.2]} /><meshBasicMaterial color="#38bdf8" transparent opacity={0.18} /></mesh>
    </group>
  );
}

function Intersection({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh receiveShadow><cylinderGeometry args={[12, 12, 0.18, 64]} /><meshStandardMaterial color="#1b2029" roughness={0.96} metalness={0.025} /></mesh>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[9.7, 9.7, 0.035, 64]} /><meshStandardMaterial color="#222934" roughness={0.92} transparent opacity={0.9} /></mesh>
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[4.4, 4.8, 64]} /><meshBasicMaterial color="#f6f388" transparent opacity={0.16} side={THREE.DoubleSide} /></mesh>
      {[[-8.8, 0], [8.8, 0], [0, -8.8], [0, 8.8]].map(([x, z], i) => <mesh key={i} position={[x, 0.16, z]}><boxGeometry args={Math.abs(x) > 0 ? [0.24, 0.014, 6.6] : [6.6, 0.014, 0.24]} /><meshBasicMaterial color="#94a3b8" transparent opacity={0.42} /></mesh>)}
    </group>
  );
}

function Crosswalks({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {[-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8].map((offset) => <mesh key={`h-${offset}`} position={[offset, 0.17, -7.2]}><boxGeometry args={[0.95, 0.014, 3.0]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.035} roughness={0.4} /></mesh>)}
      {[-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8].map((offset) => <mesh key={`v-${offset}`} position={[-7.2, 0.17, offset]}><boxGeometry args={[3.0, 0.014, 0.95]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.035} roughness={0.4} /></mesh>)}
    </group>
  );
}

function StreetLampRibbon() {
  const positions: Vec3[] = [];
  for (let x = loop.left + 12; x <= loop.right - 12; x += 17) {
    positions.push([x, 0, loop.top + 11], [x, 0, loop.bottom - 11]);
  }
  for (let z = loop.bottom + 12; z <= loop.top - 12; z += 17) {
    positions.push([loop.left - 11, 0, z], [loop.right + 11, 0, z]);
  }
  return <group>{positions.map((p, i) => <StreetLamp key={i} position={p} />)}</group>;
}

function StreetLamp({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 2.4, 0]}><cylinderGeometry args={[0.05, 0.07, 4.8, 8]} /><meshStandardMaterial color="#9ca3af" metalness={0.55} roughness={0.32} /></mesh>
      <mesh position={[0, 4.9, 0]}><sphereGeometry args={[0.3, 16, 16]} /><meshStandardMaterial color="#fef3c7" emissive="#f6f388" emissiveIntensity={1.35} /></mesh>
      <pointLight position={[0, 4.7, 0]} color="#f6f388" intensity={0.52} distance={14} />
    </group>
  );
}

function LoopDirectionArrows() {
  const arrows = [
    ...[28, 2, -24, -48].map((z) => ({ p: [-38.6, 0.18, z] as Vec3, rot: Math.PI })),
    ...[-18, 22, 62, 102, 142].map((x) => ({ p: [x, 0.18, -58.6] as Vec3, rot: Math.PI / 2 })),
    ...[-35, -8, 18].map((z) => ({ p: [158.6, 0.18, z] as Vec3, rot: 0 })),
    ...[-18, 22, 62, 102, 142].map((x) => ({ p: [x, 0.18, 38.6] as Vec3, rot: -Math.PI / 2 }))
  ];
  return <group>{arrows.map((a, i) => <group key={i} position={a.p} rotation={[0, a.rot, 0]}><mesh><coneGeometry args={[0.46, 1.3, 3]} /><meshBasicMaterial color="#f8fafc" transparent opacity={0.42} /></mesh></group>)}</group>;
}

function CareerRoadLines() {
  const roads = [
    { p: [-18, 1.0, 47.5] as Vec3, text: "ORIGIN ROAD  ·  LEFT LANE  ·  CSE + SYSTEMS FOUNDATION", color: "#f6f388" },
    { p: [72, 1.0, 47.5] as Vec3, text: "mADESTIC BOULEVARD  ·  ERP + PRODUCT OPS", color: "#7dd3fc" },
    { p: [165.5, 1.0, -4] as Vec3, text: "ACCESSIBILITY AVENUE  ·  BLIND-FIRST HCI", color: "#a7f3d0" },
    { p: [78, 1.0, -67.5] as Vec3, text: "SUPPLY CHAIN + LEADERSHIP  ·  OPS + TEAMS", color: "#34d399" },
    { p: [-45.5, 1.0, -24] as Vec3, text: "FUTURE RETURN ROAD  ·  AI + HCI RESEARCH", color: "#c4b5fd" }
  ];
  return <group>{roads.map((road) => <Html key={road.text} position={road.p} center distanceFactor={20} className="pointer-events-none"><div className="whitespace-nowrap rounded-full border bg-black/56 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] shadow-2xl backdrop-blur-md [backface-visibility:hidden]" style={{ color: road.color, borderColor: `${road.color}55` }}>{road.text}</div></Html>)}</group>;
}


function BangladeshLeftDriveMarkers() {
  const markers = [
    { p: [-22, 0.42, 45.8] as Vec3, text: "LEFT LANE" },
    { p: [70, 0.42, 45.8] as Vec3, text: "KEEP LEFT" },
    { p: [165.8, 0.42, -8] as Vec3, text: "LEFT LANE" },
    { p: [82, 0.42, -65.8] as Vec3, text: "KEEP LEFT" },
    { p: [-45.8, 0.42, -26] as Vec3, text: "LEFT LANE" }
  ];
  return (
    <group>
      {markers.map((m, i) => (
        <Html key={i} position={m.p} center distanceFactor={18} className="pointer-events-none">
          <div className="rounded-md border border-[#f6f388]/25 bg-black/46 px-2 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-[#f6f388] backdrop-blur-sm [backface-visibility:hidden]">{m.text}</div>
        </Html>
      ))}
    </group>
  );
}

function LoopMonuments() {
  return (
    <group>
      <group position={[-34, 0, 42]}>
        <mesh castShadow position={[0, 3.2, -7.7]}><cylinderGeometry args={[0.18, 0.24, 6.4, 14]} /><meshStandardMaterial color="#f6f388" emissive="#f6f388" emissiveIntensity={0.35} metalness={0.55} roughness={0.24} /></mesh>
        <mesh castShadow position={[0, 3.2, 7.7]}><cylinderGeometry args={[0.18, 0.24, 6.4, 14]} /><meshStandardMaterial color="#f6f388" emissive="#f6f388" emissiveIntensity={0.35} metalness={0.55} roughness={0.24} /></mesh>
        <mesh castShadow position={[0, 6.45, 0]}><boxGeometry args={[0.7, 0.34, 15.8]} /><meshStandardMaterial color="#111827" emissive="#f6f388" emissiveIntensity={0.16} roughness={0.32} metalness={0.5} /></mesh>
        <mesh position={[0, 6.7, 0]}><boxGeometry args={[0.74, 0.08, 13.6]} /><meshBasicMaterial color="#f6f388" transparent opacity={0.55} /></mesh>
        <Html position={[0, 8.0, 0]} center distanceFactor={13} className="pointer-events-none w-[250px]">
          <div className="rounded-full border border-[#f6f388]/35 bg-black/58 px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.24em] text-[#f6f388] shadow-2xl backdrop-blur-xl">Start / Finish Gate</div>
        </Html>
      </group>
    </group>
  );
}

function DistrictAtmosphere() {
  return (
    <group>
      <mesh position={[75, 0.012, 25]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[44, 80]} /><meshBasicMaterial color="#7dd3fc" transparent opacity={0.032} /></mesh>
      <mesh position={[142, 0.012, -2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[36, 80]} /><meshBasicMaterial color="#a7f3d0" transparent opacity={0.035} /></mesh>
      <mesh position={[78, 0.012, -40]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[46, 80]} /><meshBasicMaterial color="#34d399" transparent opacity={0.03} /></mesh>
      <mesh position={[-22, 0.012, -26]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[36, 80]} /><meshBasicMaterial color="#c4b5fd" transparent opacity={0.035} /></mesh>
    </group>
  );
}

function Building({ building }: { building: CityBuilding }) {
  const color = districtColors[building.kind];
  const [w, h, d] = building.size;
  const windowRows = Math.max(5, Math.floor(h / 2.7));
  const windowCols = Math.max(4, Math.floor(w / 1.85));
  return (
    <group position={building.position} rotation={[0, building.rotation ?? 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.14, 0]}><boxGeometry args={[w + 5.2, 0.28, d + 5.2]} /><meshStandardMaterial color="#0b1018" roughness={0.54} metalness={0.24} /></mesh>
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}><boxGeometry args={[w + 3.2, 1.22, d + 3.2]} /><meshStandardMaterial color="#1d2430" roughness={0.48} metalness={0.32} /></mesh>
      <mesh castShadow receiveShadow position={[-w * 0.22, h / 2 + 1.08, 0]}><boxGeometry args={[w * 0.7, h, d]} /><meshPhysicalMaterial color="#172234" roughness={0.16} metalness={0.66} clearcoat={0.9} clearcoatRoughness={0.13} emissive="#07101f" emissiveIntensity={0.24} /></mesh>
      <mesh castShadow receiveShadow position={[w * 0.28, h * 0.38 + 1.08, d * 0.08]}><boxGeometry args={[w * 0.5, h * 0.76, d * 0.82]} /><meshPhysicalMaterial color="#101a2a" roughness={0.15} metalness={0.7} clearcoat={0.95} clearcoatRoughness={0.1} emissive="#07101f" emissiveIntensity={0.26} /></mesh>
      <mesh castShadow receiveShadow position={[0, h * 0.24 + 1.08, -d * 0.36]}><boxGeometry args={[w * 0.38, h * 0.48, d * 0.36]} /><meshPhysicalMaterial color="#1c2737" roughness={0.18} metalness={0.6} clearcoat={0.8} /></mesh>
      <mesh position={[-w * 0.22, h / 2 + 1.1, d / 2 + 0.055]}><boxGeometry args={[w * 0.62, h - 1.2, 0.06]} /><meshBasicMaterial color={color} transparent opacity={0.075} /></mesh>
      <mesh position={[w * 0.28, h * 0.38 + 1.1, d * 0.49 + 0.055]}><boxGeometry args={[w * 0.42, h * 0.76 - 1, 0.06]} /><meshBasicMaterial color="#dbeafe" transparent opacity={0.05} /></mesh>
      {[-w / 2 - 0.08, w / 2 + 0.08].map((x, i) => <mesh key={i} position={[x, h / 2 + 1.05, 0]}><boxGeometry args={[0.09, h - 0.4, d + 0.15]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={i === 0 ? 0.52 : 0.28} transparent opacity={0.58} /></mesh>)}
      <mesh castShadow position={[-w * 0.22, h + 1.85, 0]}><boxGeometry args={[w * 0.62, Math.max(1.25, h * 0.055), d * 0.82]} /><meshStandardMaterial color="#28354b" roughness={0.34} metalness={0.46} emissive={color} emissiveIntensity={0.06} /></mesh>
      <mesh position={[-w * 0.22, h + 2.5, 0]}><boxGeometry args={[w * 0.44, 0.12, d * 0.62]} /><meshBasicMaterial color={color} transparent opacity={0.45} /></mesh>
      <mesh castShadow position={[-w * 0.22, h + 3.2, 0]}><cylinderGeometry args={[0.1, 0.14, 2.0, 12]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.75} /></mesh>
      <BuildingWindows w={w} h={h} d={d} rows={windowRows} cols={windowCols} color={color} />
      <mesh position={[0, 0.42, -d / 2 - 1.25]}><boxGeometry args={[w * 0.68, 0.32, 0.45]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.42} roughness={0.42} /></mesh>
      <Html position={[0, h + 4.6, 0]} center distanceFactor={44} className="pointer-events-none"><div className="building-label rounded-xl border border-white/10 bg-[#02050a]/56 px-3 py-1.5 text-center shadow-2xl shadow-black/70 backdrop-blur-xl"><div className="whitespace-nowrap text-[11px] font-black text-white">{building.title}</div><div className="whitespace-nowrap text-[9px] font-semibold text-white/48">{building.subtitle}</div></div></Html>
    </group>
  );
}

function BuildingWindows({ w, h, d, rows, cols, color }: { w: number; h: number; d: number; rows: number; cols: number; color: string }) {
  const windows = useMemo(() => {
    const items: { p: Vec3; s: Vec3; r?: Vec3; on: boolean }[] = [];
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const x = -w / 2 + 1 + (col * (w - 2)) / Math.max(1, cols - 1);
      const y = 3 + (row * (h - 5)) / Math.max(1, rows - 1);
      items.push({ p: [x, y, d / 2 + 0.045], s: [0.5, 0.035, 0.46], on: (row * 7 + col * 5) % 6 !== 0 });
      items.push({ p: [x, y, -d / 2 - 0.045], s: [0.5, 0.035, 0.46], r: [0, Math.PI, 0], on: (row * 3 + col * 2) % 5 !== 0 });
    }
    const sideRows = Math.max(3, Math.floor(rows * 0.8));
    const sideCols = Math.max(2, Math.floor(d / 2.1));
    for (let row = 0; row < sideRows; row++) for (let col = 0; col < sideCols; col++) {
      const z = -d / 2 + 1 + (col * (d - 2)) / Math.max(1, sideCols - 1);
      const y = 3 + (row * (h - 5)) / Math.max(1, sideRows - 1);
      items.push({ p: [w / 2 + 0.045, y, z], s: [0.46, 0.035, 0.44], r: [0, Math.PI / 2, 0], on: (row + col) % 4 !== 0 });
    }
    return items;
  }, [w, h, d, rows, cols]);
  return <group>{windows.map((win, i) => <mesh key={i} position={win.p} rotation={win.r ?? [0, 0, 0]}><boxGeometry args={win.s} /><meshStandardMaterial color={win.on ? "#dbeafe" : "#182233"} emissive={win.on ? color : "#000000"} emissiveIntensity={win.on ? 0.42 : 0} roughness={0.18} metalness={0.18} /></mesh>)}</group>;
}

function ParkingBay({ building }: { building: CityBuilding }) {
  const color = districtColors[building.kind];
  const [w, d] = building.parking.size;
  return (
    <group position={building.parking.position} rotation={[0, building.parking.rotation ?? 0, 0]}>
      <mesh receiveShadow><boxGeometry args={[w, 0.075, d]} /><meshStandardMaterial color="#111821" roughness={0.9} metalness={0.04} emissive={color} emissiveIntensity={0.09} /></mesh>
      <mesh position={[0, 0.087, 0]}><boxGeometry args={[w - 0.46, 0.012, d - 0.46]} /><meshBasicMaterial color={color} transparent opacity={0.065} /></mesh>
      {[-w / 2 + 0.38, w / 2 - 0.38].map((x) => <mesh key={x} position={[x, 0.12, 0]}><boxGeometry args={[0.1, 0.014, d - 0.62]} /><meshBasicMaterial color="#f8fafc" transparent opacity={0.48} /></mesh>)}
      <mesh position={[0, 0.12, d / 2 - 0.42]}><boxGeometry args={[w - 0.7, 0.014, 0.1]} /><meshBasicMaterial color="#f8fafc" transparent opacity={0.38} /></mesh>
      <mesh position={[0, 0.14, -0.35]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.95, 1.08, 40]} /><meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
      <Html position={[0, 0.82, -0.35]} center distanceFactor={34} className="pointer-events-none"><div className="rounded-full border border-white/12 bg-black/50 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-white/72 backdrop-blur-md">P</div></Html>
    </group>
  );
}

function PuzzleParkingBay({ zone }: { zone: PuzzleZone }) {
  return (
    <group position={zone.position} rotation={[0, zone.rotation ?? 0, 0]}>
      <mesh receiveShadow><boxGeometry args={[zone.size[0], 0.085, zone.size[1]]} /><meshStandardMaterial color="#0b1a2b" roughness={0.82} emissive="#38bdf8" emissiveIntensity={0.2} /></mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.05, 2.35, 48]} /><meshBasicMaterial color="#38bdf8" transparent opacity={0.42} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.14, 0]}><boxGeometry args={[zone.size[0] - 0.6, 0.012, 0.12]} /><meshBasicMaterial color="#38bdf8" transparent opacity={0.38} /></mesh>
      <Html position={[0, 1.22, 0]} center distanceFactor={25} className="pointer-events-none"><div className="rounded-full border border-sky-200/25 bg-sky-950/58 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-sky-100 backdrop-blur-md">Puzzle Bay</div></Html>
    </group>
  );
}

function WorldStorySigns() {
  const signs = [
    { p: [-20, 0, 56] as Vec3, r: 0, title: "Welcome to Mueed City", body: "Bangladesh-style left-lane loop. Drive forward; the first story stops are on your left." },
    { p: [74, 0, 56] as Vec3, r: 0, title: "mADestic Downtown", body: "ERP, retail operations, dashboards, workflows, and real client complexity." },
    { p: [174, 0, -4] as Vec3, r: Math.PI / 2, title: "Blind-First District", body: "Braille, audio, hardware, HCI, and interfaces made for non-visual use." },
    { p: [82, 0, -76] as Vec3, r: Math.PI, title: "Supply Chain Lane", body: "Stock visibility, SKU mapping, CPP, OLA, marketplace reporting." },
    { p: [-56, 0, -28] as Vec3, r: -Math.PI / 2, title: "Future Return Road", body: "Agentic AI, HCI research, Japan/MEXT, and systems that reduce chaos." }
  ];
  return <group>{signs.map((sign) => <BillboardSign key={sign.title} {...sign} />)}</group>;
}

function BillboardSign({ p, r = 0, title, body }: { p: Vec3; r?: number; title: string; body: string }) {
  return (
    <group position={p} rotation={[0, r, 0]}>
      <mesh castShadow position={[0, 2.1, 0]}><boxGeometry args={[9.2, 3.8, 0.24]} /><meshStandardMaterial color="#0b1220" roughness={0.35} metalness={0.5} emissive="#071222" emissiveIntensity={0.45} /></mesh>
      <mesh position={[0, 2.1, -0.14]}><boxGeometry args={[8.6, 3.2, 0.04]} /><meshBasicMaterial color="#f6f388" transparent opacity={0.08} /></mesh>
      <mesh castShadow position={[-3.8, 0.9, 0]}><cylinderGeometry args={[0.08, 0.08, 2, 8]} /><meshStandardMaterial color="#64748b" /></mesh>
      <mesh castShadow position={[3.8, 0.9, 0]}><cylinderGeometry args={[0.08, 0.08, 2, 8]} /><meshStandardMaterial color="#64748b" /></mesh>
      <Html position={[0, 2.15, -0.34]} center distanceFactor={14} className="pointer-events-none w-[330px]">
        <div className="rounded-xl border border-[#f6f388]/25 bg-black/66 p-3 text-center shadow-2xl backdrop-blur-xl [backface-visibility:hidden]">
          <div className="text-sm font-black text-[#f6f388]">{title}</div>
          <div className="mt-1 text-xs font-semibold leading-5 text-white/76">{body}</div>
        </div>
      </Html>
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh castShadow position={[0, 0.75, 0]}><cylinderGeometry args={[0.12, 0.16, 1.5, 8]} /><meshStandardMaterial color="#5b3c25" roughness={0.8} /></mesh>
      <mesh castShadow position={[0, 1.8, 0]}><coneGeometry args={[0.9, 1.8, 9]} /><meshStandardMaterial color="#124332" roughness={0.7} emissive="#062017" emissiveIntensity={0.14} /></mesh>
      <mesh castShadow position={[0, 2.45, 0]}><coneGeometry args={[0.65, 1.5, 9]} /><meshStandardMaterial color="#166346" roughness={0.7} emissive="#062017" emissiveIntensity={0.12} /></mesh>
    </group>
  );
}

function pointOnLoop(t: number, laneOffset = 0) {
  // Clockwise lap. Positive laneOffset is the Bangladesh left lane/outside shoulder for each road direction.
  const a1 = new THREE.Vector3(loop.left + 6, 0.36, loop.top + laneOffset);
  const b1 = new THREE.Vector3(loop.right - 6, 0.36, loop.top + laneOffset);
  const a2 = new THREE.Vector3(loop.right + laneOffset, 0.36, loop.top - 6);
  const b2 = new THREE.Vector3(loop.right + laneOffset, 0.36, loop.bottom + 6);
  const a3 = new THREE.Vector3(loop.right - 6, 0.36, loop.bottom - laneOffset);
  const b3 = new THREE.Vector3(loop.left + 6, 0.36, loop.bottom - laneOffset);
  const a4 = new THREE.Vector3(loop.left - laneOffset, 0.36, loop.bottom + 6);
  const b4 = new THREE.Vector3(loop.left - laneOffset, 0.36, loop.top - 6);
  const segments = [[a1, b1], [a2, b2], [a3, b3], [a4, b4]] as const;
  const lengths = segments.map(([a, b]) => a.distanceTo(b));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let d = ((t % total) + total) % total;
  let segment = segments[0];
  for (let i = 0; i < segments.length; i++) {
    if (d <= lengths[i]) { segment = segments[i]; break; }
    d -= lengths[i];
  }
  const [a, b] = segment;
  const pos = a.clone().lerp(b, THREE.MathUtils.clamp(d / a.distanceTo(b), 0, 1));
  const angle = Math.atan2(b.x - a.x, b.z - a.z);
  return { pos, angle, total };
}

function TrafficSystem() {
  const cars = ["#ef4444", "#eab308", "#22c55e", "#38bdf8", "#f97316", "#a78bfa", "#f6f388"];
  return <group>{cars.map((color, i) => <LoopTrafficCar key={color} color={color} offset={i * 58} laneOffset={i % 4 === 0 ? -3.4 : 3.4} speed={7.5 + (i % 3) * 1.2} />)}</group>;
}

function LoopTrafficCar({ color, offset, laneOffset, speed }: { color: string; offset: number; laneOffset: number; speed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const { pos, angle } = pointOnLoop(clock.elapsedTime * speed + offset, laneOffset);
    ref.current.position.copy(pos);
    ref.current.rotation.y = angle;
  });
  return <group ref={ref}><SmallCar color={color} /></group>;
}

function SmallCar({ color = "#f6f388" }: { color?: string }) {
  return (
    <group scale={[0.8, 0.8, 0.8]}>
      <mesh castShadow position={[0, 0.34, 0]}><boxGeometry args={[1.55, 0.5, 3.0]} /><meshStandardMaterial color={color} roughness={0.42} metalness={0.2} /></mesh>
      <mesh castShadow position={[0, 0.78, -0.18]}><boxGeometry args={[1.12, 0.54, 1.35]} /><meshStandardMaterial color="#0f172a" roughness={0.24} metalness={0.55} transparent opacity={0.88} /></mesh>
      {[-0.82, 0.82].map((x) => [-1.05, 1.05].map((z) => <mesh key={`${x}-${z}`} position={[x, 0.16, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.22, 0.22, 0.22, 16]} /><meshStandardMaterial color="#060606" roughness={0.5} /></mesh>))}
      <mesh position={[0, 0.46, 1.55]}><boxGeometry args={[1.1, 0.12, 0.06]} /><meshBasicMaterial color="#fff7ad" /></mesh>
    </group>
  );
}

function MobileControls() {
  const buttons = [
    { key: "ArrowUp", label: "▲", cls: "left-1/2 -translate-x-1/2 top-0" },
    { key: "ArrowLeft", label: "◀", cls: "left-0 top-14" },
    { key: "ArrowRight", label: "▶", cls: "right-0 top-14" },
    { key: "ArrowDown", label: "▼", cls: "left-1/2 -translate-x-1/2 top-28" }
  ];
  const press = (key: string, down: boolean) => window.dispatchEvent(new CustomEvent("mueed-city-mobile-control", { detail: { key, down } }));
  return <div className="absolute bottom-5 left-5 z-30 h-44 w-44 md:hidden">{buttons.map((button) => <button key={button.key} onTouchStart={(e) => { e.preventDefault(); press(button.key, true); }} onTouchEnd={(e) => { e.preventDefault(); press(button.key, false); }} onMouseDown={() => press(button.key, true)} onMouseUp={() => press(button.key, false)} className={`absolute h-14 w-14 rounded-2xl border border-white/15 bg-black/55 text-xl font-black text-white shadow-xl backdrop-blur-xl ${button.cls}`}>{button.label}</button>)}</div>;
}

function CarController({ carRef, carState, activeRef, onActiveZone }: { carRef: RefObject<THREE.Group>; carState: MutableRefObject<{ speed: number }>; activeRef: MutableRefObject<string | null>; onActiveZone: (zone: ActiveZone) => void }) {
  const keys = useRef<Record<string, boolean>>({});
  const position = useRef(new THREE.Vector3(loop.left + 12, 0.48, loop.top + 3.4));
  const angle = useRef(Math.PI / 2);
  const speed = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) e.preventDefault(); };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    const mobile = (e: Event) => { const custom = e as CustomEvent<{ key: string; down: boolean }>; keys.current[custom.detail.key.toLowerCase()] = custom.detail.down; };
    window.addEventListener("keydown", down); window.addEventListener("keyup", up); window.addEventListener("mueed-city-mobile-control", mobile as EventListener);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("mueed-city-mobile-control", mobile as EventListener); };
  }, []);

  useFrame((_, delta) => {
    const k = keys.current;
    const forward = k.w || k.arrowup;
    const backward = k.s || k.arrowdown;
    const left = k.a || k.arrowleft;
    const right = k.d || k.arrowright;
    const maxSpeed = 13.8;
    const reverseMax = -6.4;
    const accel = 16;
    const brake = 19;
    const friction = 5.8;
    if (forward) speed.current += accel * delta;
    if (backward) speed.current -= brake * delta;
    if (!forward && !backward) {
      const f = friction * delta;
      if (speed.current > 0) speed.current = Math.max(0, speed.current - f);
      if (speed.current < 0) speed.current = Math.min(0, speed.current + f);
    }
    speed.current = THREE.MathUtils.clamp(speed.current, reverseMax, maxSpeed);
    const steerPower = THREE.MathUtils.clamp(Math.abs(speed.current) / 8, 0.32, 1);
    const steer = 1.45 * steerPower * delta * Math.sign(speed.current || 1);
    if (left) angle.current += steer;
    if (right) angle.current -= steer;
    position.current.x += Math.sin(angle.current) * speed.current * delta;
    position.current.z += Math.cos(angle.current) * speed.current * delta;
    position.current.x = THREE.MathUtils.clamp(position.current.x, -82, 196);
    position.current.z = THREE.MathUtils.clamp(position.current.z, -102, 82);
    if (carRef.current) { carRef.current.position.copy(position.current); carRef.current.rotation.y = angle.current; }
    carState.current.speed = speed.current;
    let nextActive: ActiveZone = null;
    if (Math.abs(speed.current) < 1.15) {
      const building = buildings.find((b) => inRotatedZone(position.current, b.parking));
      if (building) nextActive = { type: "building", id: building.id };
      const puzzle = puzzleZones.find((p) => inRotatedZone(position.current, p));
      if (puzzle) nextActive = { type: "puzzle", id: puzzle.id };
    }
    const key = nextActive ? `${nextActive.type}:${nextActive.id}` : null;
    if (activeRef.current !== key) { activeRef.current = key; onActiveZone(nextActive); }
  });
  return <group ref={carRef} position={position.current} rotation={[0, angle.current, 0]}><HeroCar /></group>;
}

function HeroCar() {
  return (
    <group scale={[1.08, 1.08, 1.08]}>
      <mesh castShadow receiveShadow position={[0, 0.34, 0.1]}><boxGeometry args={[2.1, 0.38, 4.25]} /><meshPhysicalMaterial color="#f6f388" roughness={0.18} metalness={0.58} clearcoat={1} clearcoatRoughness={0.08} /></mesh>
      <mesh castShadow receiveShadow position={[0, 0.5, 1.15]}><boxGeometry args={[1.86, 0.2, 1.65]} /><meshPhysicalMaterial color="#fff8a8" roughness={0.16} metalness={0.5} clearcoat={0.9} /></mesh>
      <mesh castShadow receiveShadow position={[0, 0.51, -1.2]}><boxGeometry args={[1.9, 0.22, 1.62]} /><meshPhysicalMaterial color="#d9d86e" roughness={0.22} metalness={0.44} clearcoat={0.85} /></mesh>
      <mesh castShadow position={[0, 0.98, -0.26]}><boxGeometry args={[1.42, 0.68, 1.45]} /><meshPhysicalMaterial color="#0d1420" roughness={0.05} metalness={0.86} clearcoat={1} transparent opacity={0.92} /></mesh>
      <mesh position={[0, 1.33, -0.26]}><boxGeometry args={[1.07, 0.07, 1.0]} /><meshStandardMaterial color="#dbeafe" emissive="#7dd3fc" emissiveIntensity={0.22} transparent opacity={0.36} /></mesh>
      <mesh castShadow position={[0, 0.43, 2.24]}><boxGeometry args={[1.72, 0.2, 0.18]} /><meshStandardMaterial color="#111827" roughness={0.35} metalness={0.32} /></mesh>
      <mesh castShadow position={[0, 0.49, -2.22]}><boxGeometry args={[1.9, 0.12, 0.34]} /><meshStandardMaterial color="#111827" roughness={0.35} metalness={0.32} /></mesh>
      <mesh castShadow position={[0, 0.76, -2.42]}><boxGeometry args={[2.15, 0.08, 0.22]} /><meshStandardMaterial color="#0b0f16" roughness={0.3} metalness={0.55} /></mesh>
      <mesh position={[0, 0.74, 2.42]}><boxGeometry args={[1.9, 0.08, 0.14]} /><meshBasicMaterial color="#7dd3fc" transparent opacity={0.45} /></mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.8, 3.35, 60]} /><meshBasicMaterial color="#7dd3fc" transparent opacity={0.07} side={THREE.DoubleSide} /></mesh>
      {[-1.12, 1.12].map((x) => [-1.32, 1.28].map((z) => <group key={`${x}-${z}`} position={[x, 0.23, z]} rotation={[0, 0, Math.PI / 2]}><mesh castShadow><cylinderGeometry args={[0.37, 0.37, 0.32, 32]} /><meshStandardMaterial color="#020305" roughness={0.42} metalness={0.18} /></mesh><mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.21, 0.21, 0.045, 28]} /><meshStandardMaterial color="#d7dde7" metalness={0.92} roughness={0.18} /></mesh></group>))}
      {[-0.56, 0.56].map((x) => <mesh key={x} position={[x, 0.58, 2.29]}><boxGeometry args={[0.48, 0.12, 0.06]} /><meshBasicMaterial color="#fff7ad" /></mesh>)}
      <pointLight position={[-0.58, 0.62, 2.82]} intensity={1.35} distance={18} color="#fef3c7" />
      <pointLight position={[0.58, 0.62, 2.82]} intensity={1.35} distance={18} color="#fef3c7" />
      {[-0.58, 0.58].map((x) => <mesh key={x} position={[x, 0.54, -2.33]}><boxGeometry args={[0.44, 0.13, 0.08]} /><meshBasicMaterial color="#ef4444" /></mesh>)}
    </group>
  );
}

function CameraRig({ carRef, cameraMode }: { carRef: RefObject<THREE.Group>; cameraMode: "cinematic" | "driver" | "wide" }) {
  const target = useRef(new THREE.Vector3());
  useFrame(({ camera }, delta) => {
    if (!carRef.current) return;
    const car = carRef.current;
    const dir = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y));
    let desired: THREE.Vector3;
    if (cameraMode === "driver") {
      desired = car.position.clone().add(new THREE.Vector3(0, 5.4, 0)).add(dir.clone().multiplyScalar(-10));
      target.current.copy(car.position.clone().add(dir.clone().multiplyScalar(13)).add(new THREE.Vector3(0, 1.9, 0)));
    } else if (cameraMode === "wide") {
      desired = car.position.clone().add(new THREE.Vector3(0, 56, 50)).add(dir.clone().multiplyScalar(-22));
      target.current.copy(car.position.clone().add(new THREE.Vector3(0, 0.5, -2)));
    } else {
      desired = car.position.clone().add(new THREE.Vector3(0, 25, 32)).add(dir.clone().multiplyScalar(-24));
      target.current.copy(car.position.clone().add(dir.clone().multiplyScalar(10)).add(new THREE.Vector3(0, 1.1, 0)));
    }
    camera.position.lerp(desired, 1 - Math.pow(0.0001, delta));
    camera.lookAt(target.current);
  });
  return null;
}

function MiniMap({ activeZone }: { activeZone: ActiveZone }) {
  return (
    <div className="absolute bottom-6 right-6 z-20 hidden h-52 w-80 rounded-3xl border border-white/10 bg-black/45 p-3 shadow-2xl backdrop-blur-2xl md:block">
      <div className="mb-2 flex items-center justify-between"><div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/45">Clean Left-Drive Loop</div><div className="text-[10px] font-bold text-[#f6f388]">{activeZone ? "Parked" : "Exploring"}</div></div>
      <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
        <div className="absolute rounded-[2rem] border-[7px] border-white/18" style={{ left: "9%", top: "15%", width: "82%", height: "66%" }} />
        <div className="absolute left-[7%] top-[12%] rounded-full border border-[#f6f388]/30 bg-[#f6f388]/10 px-2 py-1 text-[8px] font-black text-[#f6f388]">START</div>
        {buildings.map((b) => <div key={b.id} className="absolute h-2 w-2 rounded-full shadow-lg" style={{ left: `${((b.position[0] + 86) / 288) * 100}%`, top: `${((b.position[2] + 104) / 190) * 100}%`, background: districtColors[b.kind] }} title={b.title} />)}
      </div>
    </div>
  );
}

function InteractionPanel({ building, puzzle, onClose }: { building?: CityBuilding; puzzle?: PuzzleZone; onClose: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => setSelected(null), [puzzle?.id]);
  if (building) return (
    <aside className="pointer-events-auto absolute right-4 top-24 z-30 w-[calc(100%-2rem)] max-w-[420px] overflow-hidden rounded-[1.6rem] border border-white/12 bg-[#02050a]/86 shadow-[0_34px_160px_rgba(0,0,0,.75)] backdrop-blur-2xl md:right-6 md:top-28">
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${districtColors[building.kind]}, transparent)` }} />
      <div className="relative p-5">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-black text-white/70 transition hover:bg-white/14 hover:text-white">Close</button>
        <div className="pr-16"><div className="text-[9px] font-black uppercase tracking-[0.34em]" style={{ color: districtColors[building.kind] }}>{building.district}</div><h2 className="mt-2 text-2xl font-black leading-[1.02] tracking-[-0.05em] text-white md:text-3xl">{building.title}</h2><p className="mt-3 text-xs font-semibold leading-5 text-white/58">{building.details.role}</p></div>
        <div className="my-4 h-px bg-white/10" />
        <div className="text-[9px] font-black uppercase tracking-[0.28em] text-white/34">Unlocked story</div>
        <p className="mt-2 text-sm leading-6 text-white/78">{building.details.story}</p>
        <div className="mt-4 flex flex-wrap gap-2">{building.details.stack.slice(0, 6).map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-black text-white/66">{item}</span>)}</div>
        <div className="mt-4 grid gap-2">{building.details.impact.map((impact) => <div key={impact} className="rounded-2xl border border-white/9 bg-white/[0.045] p-3 text-xs leading-5 text-white/66">{impact}</div>)}</div>
      </div>
    </aside>
  );
  if (puzzle) {
    const correct = selected === puzzle.answer;
    return (
      <aside className="pointer-events-auto absolute right-4 top-24 z-30 w-[calc(100%-2rem)] max-w-[420px] overflow-hidden rounded-[1.6rem] border border-sky-200/18 bg-[#03101f]/88 p-5 shadow-[0_34px_150px_rgba(0,0,0,.78)] backdrop-blur-2xl md:right-6 md:top-28">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-black text-white/70 transition hover:bg-white/14 hover:text-white">Close</button>
        <div className="text-[9px] font-black uppercase tracking-[0.32em] text-sky-200">Puzzle Parking</div>
        <h2 className="mt-2 pr-14 text-2xl font-black tracking-[-0.04em]">{puzzle.title}</h2>
        <p className="mt-4 text-sm font-bold leading-6 text-white/82">{puzzle.question}</p>
        <div className="mt-4 grid gap-2">{puzzle.options.map((option, index) => <button key={option} onClick={() => setSelected(index)} className={`rounded-2xl border px-4 py-3 text-left text-xs font-black transition ${selected === index ? (correct ? "border-emerald-300/45 bg-emerald-300/15 text-emerald-100" : "border-rose-300/45 bg-rose-300/15 text-rose-100") : "border-white/10 bg-white/[0.055] text-white/74 hover:bg-white/10 hover:text-white"}`}>{option}</button>)}</div>
        {selected !== null && <p className={`mt-4 rounded-2xl border p-4 text-xs font-semibold leading-5 ${correct ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-rose-300/20 bg-rose-300/10 text-rose-100"}`}>{correct ? puzzle.reward : "Not quite. Try thinking like an operator: protect the workflow truth first."}</p>}
      </aside>
    );
  }
  return null;
}

export default MueedCity3D;
