import Link from 'next/link';

export function TopNavAudience() {
  return (
    <nav className="w-full border-b border-white/10 bg-gradient-to-r from-[#8261E1] via-[#6A96D2] to-[#22C4CF]">
      <div className="container mx-auto flex max-w-7xl items-center justify-start px-4 py-1">
        <ul className="flex space-x-4 text-sm font-medium text-white">
          <li>
            <Link href="/" className="hover:text-cyan-400">
              Untuk Individu
            </Link>
          </li>
          <li>
            <span className="text-white/60">|</span>
          </li>
          <li>
            <Link href="/mitra" className="hover:text-fuchsia-400">
              Untuk Mitra
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
