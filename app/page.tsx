import dynamic from "next/dynamic";
import ClassicPortfolio from "@/components/ClassicPortfolio";
import TopNav from "@/components/TopNav";

const MueedCity3D = dynamic(() => import("@/components/MueedCity3D"), {
  ssr: false,
  loading: () => (
    <section className="flex min-h-screen items-center justify-center bg-[#03050a] text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#f6f388]">Loading Mueed City</p>
        <h1 className="mt-3 text-3xl font-black">Preparing the 3D world...</h1>
      </div>
    </section>
  )
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <TopNav />
      <MueedCity3D />
      <ClassicPortfolio />
    </main>
  );
}
