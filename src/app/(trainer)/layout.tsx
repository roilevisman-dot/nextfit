import TopNav from "@/components/trainer/TopNav";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <main className="flex-1 pb-8">{children}</main>
    </div>
  );
}
