'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { X, ChevronLeft, ChevronRight, Camera, Heart } from 'lucide-react';

const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Dr. Anusha with newborn baby', caption: 'Successful Delivery' },
  { src: '/images/gallery-2.jpg', alt: 'Dr. Anusha in operation theatre', caption: 'Expert Care in OT' },
  { src: '/images/gallery-3.jpg', alt: 'Midnight delivery diary', caption: 'Midnight Delivery Diary' },
];

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#FDF8F0]/30 transition-colors duration-500">
      <Navbar />

      {/* Hero Header Section - Premium Minimal UI */}
      <section className="pt-28 pb-10 md:pt-40 md:pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="group relative bg-white/40 backdrop-blur-md rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl shadow-[#874B61]/5 border border-white/40 flex flex-col md:flex-row items-center gap-8 md:gap-14 transition-all duration-700 hover:shadow-3xl hover:scale-[1.01] hover:bg-white/50">
            {/* Glass Icon Badge */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-[#874B61]/10 blur-2xl rounded-full scale-150 opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/60 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-inner border border-white/80 transition-transform duration-700 group-hover:rotate-6">
                <Camera className="h-10 w-10 md:h-14 md:w-14 text-[#874B61] opacity-90" />
              </div>
            </div>

            {/* Typography Content */}
            <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6">
              <h1 className="text-4xl md:text-7xl font-bold text-[#874B61] tracking-tight leading-[1.1] animate-in slide-in-from-bottom duration-700">
                Patient <span className="text-[#874B61]/80">Gallery</span>
              </h1>
              <p className="text-gray-500/90 text-lg md:text-2xl font-light leading-relaxed md:leading-loose max-w-3xl animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                Step into our Patient Gallery—a celebration of courage, resilience, and healing. Each image reflects unique journeys and inspiring stories of those we&apos;ve cared for. Join us in celebrating their paths to wellness and smiles that tell their stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {galleryImages.map((img, index) => (
              <div
                key={img.src}
                className="group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-[#874B61]/20 group-hover:border-[#874B61]/40 transition-all duration-500 group-hover:shadow-2xl bg-white w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="mt-3 text-center">
                  <p className="font-medium text-[#6B3A4D] text-base">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-2 backdrop-blur-sm"
          >
            <X className="h-7 w-7" />
          </button>
          <button
            onClick={() => setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
            className="absolute left-4 md:left-8 text-white/80 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-2 backdrop-blur-sm"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={() => setLightboxIndex((prev) => (prev + 1) % galleryImages.length)}
            className="absolute right-4 md:right-8 text-white/80 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-2 backdrop-blur-sm"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="relative w-full max-w-4xl h-[85vh]">
            <Image
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-6 text-center">
            <p className="text-white font-medium">
              {galleryImages[lightboxIndex].caption}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {lightboxIndex + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
