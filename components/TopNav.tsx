import Link from "next/link";
import { profile } from "@/data/profile";

export default function TopNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/10 bg-[#02050a]/62 px-3 py-2 shadow-[0_24px_120px_rgba(0,0,0,.62)] backdrop-blur-2xl md:px-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#f6f388]/35 bg-[#f6f388]/10 text-sm font-black text-[#f6f388] shadow-[0_0_35px_rgba(246,243,136,.18)] transition group-hover:scale-105">
            <span className="absolute inset-1 rounded-full border border-white/10" />
            M
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-black uppercase leading-none tracking-[0.32em] text-white md:text-[12px]">Mueed.City</span>
            <span className="mt-1 hidden text-[11px] text-white/45 sm:block">interactive portfolio world</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 text-xs font-black text-white/58 md:flex">
          <a href="#drive" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-[#f6f388]">Drive</a>
          <a href="#classic" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-[#f6f388]">Quick View</a>
          <Link href="/projects" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-[#f6f388]">Projects</Link>
        </div>

        <a
          href={`mailto:${profile.contact.email}`}
          className="rounded-full border border-[#f6f388]/25 bg-[#f6f388]/10 px-4 py-2 text-xs font-black text-[#f6f388] shadow-[0_0_32px_rgba(246,243,136,.16)] transition hover:bg-[#f6f388] hover:text-black"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
