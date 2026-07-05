import Link from "next/link";
import { getProject, projects } from "@/data/profile";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/projects" className="text-sm text-[#f6f388] hover:underline">← All projects</Link>
        <div className="mt-10 rounded-[2.4rem] border border-white/10 bg-white/[0.04] p-7 md:p-10">
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{project.district}</span>
          <h1 className="mt-6 text-4xl font-black md:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-white/65">{project.role}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{item}</span>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-[1.7rem] border border-white/10 bg-black/20 p-6">
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Problem</h2>
              <p className="mt-4 leading-7 text-white/75">{project.problem}</p>
            </article>
            <article className="rounded-[1.7rem] border border-white/10 bg-black/20 p-6">
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Solution</h2>
              <p className="mt-4 leading-7 text-white/75">{project.solution}</p>
            </article>
          </div>

          <article className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/20 p-6">
            <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Impact</h2>
            <ul className="mt-4 grid gap-3 text-white/75 md:grid-cols-3">
              {project.impact.map((point) => (
                <li key={point} className="rounded-2xl bg-white/[0.04] p-4">{point}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
