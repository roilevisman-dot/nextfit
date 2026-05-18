import TopNav from "@/components/trainer/TopNav";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0B0A08" }}>
      <TopNav />
      <main className="flex-1 pb-8">{children}</main>
    </div>
  );
}
