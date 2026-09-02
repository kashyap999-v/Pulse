export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pulse-neutral/50 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-pulse-primary/500 mb-4">
          PULSE
        </h1>
        <p className="text-xl text-pulse-neutral/700 mb-8">
          Enterprise Business Management Platform
        </p>
        <p className="text-pulse-neutral/600 mb-12 max-w-md mx-auto">
          Foundation setup complete. Ready for development.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/login"
            className="btn-primary"
          >
            Sign In
          </a>
          <a
            href="/auth/register"
            className="btn-secondary"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
