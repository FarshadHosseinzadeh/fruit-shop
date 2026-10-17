export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8" aria-busy="true">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-stone-200" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            <div className="h-32 animate-pulse bg-stone-100 sm:h-36" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
              <div className="h-10 animate-pulse rounded-xl bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
