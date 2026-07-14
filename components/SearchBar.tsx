export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" method="GET" className="w-full max-w-xs">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-brand"
      />
    </form>
  );
}
