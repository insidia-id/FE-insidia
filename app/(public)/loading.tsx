export default function Loading() {
  return (
    <main className="min-h-screen px-4 pt-24">
      <section className="mx-auto max-w-4xl animate-pulse text-center">
        <div className="mx-auto mb-6 h-12 w-3/4 rounded bg-gray-200" />
        <div className="mx-auto mb-3 h-5 w-2/3 rounded bg-gray-200" />
        <div className="mx-auto mb-8 h-5 w-1/2 rounded bg-gray-200" />
        <div className="mx-auto h-12 w-40 rounded-full bg-gray-200" />
      </section>
    </main>
  );
}
