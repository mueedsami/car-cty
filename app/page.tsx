import CityDrive from "@/components/CityDrive";
import ClassicPortfolio from "@/components/ClassicPortfolio";
import TopNav from "@/components/TopNav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <TopNav />
      <CityDrive />
      <ClassicPortfolio />
    </main>
  );
}
