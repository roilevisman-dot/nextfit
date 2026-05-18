import BottomNav from "@/components/trainee/BottomNav";

export default function TraineeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-[100px]">{children}</main>
      <BottomNav />
    </div>
  );
}
