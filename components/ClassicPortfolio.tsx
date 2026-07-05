import Link from "next/link";
import { checkpoints, profile, projects } from "@/data/profile";

export default function ClassicPortfolio() {
  return (
    <section id="classic" className="relative overflow-hidden bg-[#080b13] px-6 py-24">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#f6f388]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#f6f388]">Quick View</p>
            <h2 className="mt-4 text-4xl font-black md:text-6xl">For people who do not want to drive.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{profile.tagline}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.roles.map((role) => (
              <div key={role} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/70">
                {role}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {checkpoints.map((point) => (
            <article key={point.id} className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
              <div className="mb-8 flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl">{point.icon}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">{point.district}</span>
              </div>
              <h3 className="text-2xl font-black">{point.title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/60">{point.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {point.metrics?.map((metric) => (
                  <span key={metric} className="rounded-full bg-white/[0.07] px-3 py-1 text-xs text-white/55">{metric}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/35">Case Studies</p>
              <h3 className="mt-3 text-3xl font-black">Project buildings inside the city</h3>
            </div>
            <Link href="/projects" className="rounded-full bg-[#f6f388] px-5 py-3 text-sm font-black text-black transition hover:scale-[1.02]">
              Open all projects
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {projects.map((project) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project.slug}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-[#f6f388]/40"
              >
                <span className="mb-6 block h-2 w-12 rounded-full" style={{ background: project.color }} />
                <h4 className="font-black">{project.title}</h4>
                <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/50">{project.solution}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
