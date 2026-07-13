export function formatDuration(seconds: number): string {
  if (seconds === 0) return '0 menit';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}j ${minutes}m`;
    }
    return `${hours} jam`;
  }
  if (minutes > 0) {
    return `${minutes} menit`;
  }
  return `${remainingSeconds} detik`;
}
