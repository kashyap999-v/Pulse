export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-pulse-neutral/50">
      {/* Sidebar will be added here */}
      {/* Header will be added here */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
