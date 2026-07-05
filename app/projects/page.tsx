import Link from "next/link";
import { projects } from "@/data/profile";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Link href="/" className="text-sm text-[#f6f388] hover:underline">← Back to city</Link>
        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.35em] text-white/45">Classic Portfolio</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">Projects & Systems</h1>
          <p className="mt-5 max-w-2xl text-white/65">
            A normal portfolio page for recruiters, professors, clients, and anyone who wants the information without driving through the city.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-[#f6f388]/45 hover:bg-white/[0.07]"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{project.district}</span>
                <span className="h-3 w-3 rounded-full" style={{ background: project.color }} />
              </div>
              <h2 className="text-2xl font-black">{project.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{project.problem}</p>
              <p className="mt-6 text-sm font-semibold text-[#f6f388]">Open case study →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
