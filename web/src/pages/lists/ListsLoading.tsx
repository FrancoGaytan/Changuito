export function ListsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
          <div className="w-10 h-10 bg-stone-200 rounded-xl mb-4" />
          <div className="h-5 bg-stone-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-stone-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
