'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Play, Star, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="flex h-auto justify-center overflow-hidden pb-5 pt-12">
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring' }} className="mb-6 text-balance font-poppins text-4xl font-bold text-dark-gray md:text-6xl lg:text-7xl">
            Ekosistem Belajar Digital untuk <span className="bg-gradient-to-r from-[#8557E4] via-[#659CD1] to-[#02C9CF] bg-clip-text text-transparent">Mengubah Wawasan Menjadi Karya Inovatif</span>
          </motion.h1>

          <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground md:text-xl">
            Insidia menghadirkan pengalaman belajar yang personal, relevan, dan mendalam bagi pelajar, mahasiswa, guru, serta profesional muda untuk bertumbuh dan siap bersaing di era global.
          </p>

          <div className="mb-10 flex flex-wrap justify-center gap-8">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-magenta" />
              <span className="font-semibold text-dark-gray">Pembelajaran Personal</span>
            </div>

            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-electric-blue" />
              <span className="font-semibold text-dark-gray">Standar Nasional</span>
            </div>

            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-pink" />
              <span className="font-semibold text-dark-gray">Wawasan Global</span>
            </div>
          </div>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant={'insidia'}>
              <Link href="/bootcamps">
                Jelajahi Program
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button variant="outline" className="cursor-pointer" size="lg">
              <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Lihat Ringkasan
            </Button>
          </div>

          {isVideoPlaying && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="relative aspect-video w-full max-w-4xl rounded-lg bg-white">
                <button onClick={() => setIsVideoPlaying(false)} className="absolute -top-12 right-0 text-white hover:text-gray-300" aria-label="Tutup modal">
                  <X className="h-6 w-6" />
                </button>

                <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-900">
                  <div className="text-center text-white">
                    <Play className="mx-auto mb-4 h-16 w-16 opacity-50" />
                    <p className="text-lg">Profil Singkat Insidia</p>
                    <p className="text-sm opacity-75">Video profil akan segera hadir.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">Dirancang untuk berbagai profil pembelajar</p>
            <div className="flex flex-wrap items-center justify-center gap-3 opacity-80">
              {['Pelajar', 'Mahasiswa', 'Guru', 'Profesional Muda'].map((item) => (
                <div key={item} className="rounded-full bg-white/70 px-4 py-2 font-semibold text-dark-gray shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
