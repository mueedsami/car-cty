import Link from "next/link";
import { profile } from "@/data/profile";

export default function TopNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/10 bg-[#030711]/58 px-4 py-2 shadow-[0_22px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-full border border-[#f6f388]/35 bg-[#f6f388]/10 text-sm font-black text-[#f6f388] shadow-glow transition group-hover:scale-105">
            <span className="absolute inset-1 rounded-full border border-white/10" />
            M
          </span>
          <span>
            <span className="block text-[12px] font-black uppercase tracking-[0.26em] leading-none text-white">Mueed.City</span>
            <span className="mt-1 block text-[11px] text-white/45">cinematic portfolio drive</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 text-xs font-bold text-white/58 md:flex">
          <a href="#drive" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-[#f6f388]">Drive</a>
          <a href="#classic" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-[#f6f388]">Quick View</a>
          <Link href="/projects" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-[#f6f388]">Projects</Link>
        </div>

        <a
          href={`mailto:${profile.contact.email}`}
          className="rounded-full border border-[#f6f388]/25 bg-[#f6f388]/10 px-4 py-2 text-xs font-black text-[#f6f388] shadow-glow transition hover:bg-[#f6f388] hover:text-black"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
