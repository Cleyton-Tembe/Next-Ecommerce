const SKELETON_CARDS = 8;

export default function CategoryLoading() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-live="polite">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <span className="sr-only">A carregar produtos…</span>

        {/* titulo*/}
        <div className="mx-auto mb-8 h-12 w-56 animate-pulse rounded-lg bg-gray-700/60" />

        {/* cards de produto */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: SKELETON_CARDS }, (_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-gray-700 shadow-lg"
            >
              <div className="mx-3 mt-3 h-60 animate-pulse rounded-xl bg-gray-700/60" />
              <div className="space-y-4 px-5 pb-5 pt-4">
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-700/60" />
                <div className="h-8 w-1/3 animate-pulse rounded bg-gray-700/60" />
                <div className="h-10 w-36 animate-pulse rounded-lg bg-emerald-900/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
