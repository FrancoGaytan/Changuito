export function FamilyLoading() {
  return (
    <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
      <div className="h-8 bg-stone-200 rounded w-1/3 mb-6 animate-pulse" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse flex gap-4">
            <div className="w-12 h-12 bg-stone-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-stone-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
