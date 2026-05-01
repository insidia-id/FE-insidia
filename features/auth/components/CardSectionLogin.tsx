import { ShieldCheck, Clock3, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CardSectionLogin = () => {
  const benefits = [
    {
      id: 'benefit-1',
      icon: ShieldCheck,
      title: 'Aman dan santai',
      description: 'Verifikasi Google bikin proses login lebih aman tanpa ribet.',
    },
    {
      id: 'benefit-2',
      icon: Clock3,
      title: 'Cepat banget',
      description: 'Tidak perlu isi form panjang, tinggal klik dan langsung lanjut belajar.',
    },
    {
      id: 'benefit-3',
      icon: Sparkles,
      title: 'Progress auto sinkron',
      description: 'Program, jadwal, dan capaianmu langsung tersimpan otomatis.',
    },
  ];
  return (
    <section className="rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl p-6 shadow-[0_30px_80px_-40px_rgba(3,20,35,0.5)] md:p-8">
      <Link href="/" className="inline-flex">
        <div className="relative flex h-14 w-32 items-center">
          <Image src="/logo.png" alt="Insidia" fill style={{ objectFit: 'contain' }} sizes="128px" priority />
        </div>
      </Link>
      <div className="mt-6 max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-100/20 px-3 py-1 text-xs font-medium text-cyan-100">
          <Sparkles className="h-3.5 w-3.5 text-cyan-100" />
          Login ceria tanpa ribet
        </div>
        <h1 className="mt-4 font-sans text-3xl font-bold leading-tight text-white drop-shadow-sm md:text-4xl">Yuk masuk dan lanjut belajar seru bareng Insidia</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/90 md:text-base">Satu klik Google dan kamu langsung bisa cek semua program, progress modul, jadwal live class, dan detail pembayaran dalam satu dashboard yang rapi.</p>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="rounded-xl border border-white/20 bg-white/12 p-3">
            <benefit.icon className="h-4 w-4 text-cyan-100" />
            <p className="mt-2 text-sm font-semibold text-white">{benefit.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CardSectionLogin;
