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
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-16">
        <div className="bg-[#F6EEDE] py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[rgba(135,75,97,0.08)] rounded-xl flex items-center justify-center">
                <Camera className="h-7 w-7 text-[#874B61]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#874B61]">
                Patient Gallery
              </h1>
            </div>
            <p className="text-[#754054]/90 text-xl max-w-3xl mx-auto leading-relaxed">
              Step into our Patient Gallery—a celebration of courage, resilience, and healing. Each image reflects unique journeys and inspiring stories of those we've cared for. Join us in celebrating their paths to wellness and smiles that tell their stories.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-[#F6EEDE]">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
