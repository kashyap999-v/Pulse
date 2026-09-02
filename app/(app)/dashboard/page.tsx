export default function AppDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-pulse-neutral/900">Dashboard</h1>
        <p className="text-pulse-neutral/600 mt-2">
          Welcome to PULSE. Dashboard content will be added in Phase 4.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <p className="text-sm text-pulse-neutral/600">Metric {i}</p>
            <p className="text-2xl font-bold text-pulse-neutral/900 mt-2">
              --
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
