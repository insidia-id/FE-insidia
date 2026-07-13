export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 rounded-2xl bg-[#8557E5]/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="h-6 w-6 rounded-full bg-[#8557E5]/20" />
        </div>
        <p className="text-gray-600">Memuat pelajaran...</p>
      </div>
    </div>
  );
}
