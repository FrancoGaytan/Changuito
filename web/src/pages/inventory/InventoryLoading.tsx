export function InventoryLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-3">
          <div className="w-11 h-11 bg-stone-200 rounded-xl" />
          <div className="flex-1">
            <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-stone-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
