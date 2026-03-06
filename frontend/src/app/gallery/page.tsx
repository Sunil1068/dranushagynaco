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
    <main className="min-h-screen bg-[#FDF8F0]/30">
      <Navbar />

      {/* Hero Header Section */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FDF8F0] rounded-3xl p-6 md:p-10 shadow-sm border border-[#874B61]/5 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            <div className="w-20 h-20 bg-[#874B61]/10 rounded-2xl flex items-center justify-center flex-shrink-0 animate-in fade-in zoom-in duration-500">
              <Camera className="h-10 w-10 text-[#874B61]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-[#874B61] mb-6 animate-in slide-in-from-left duration-500">
                Patient <span className="text-[#874B61]">Gallery</span>
              </h1>
              <div className="w-20 h-1.5 bg-[#874B61] rounded-full mb-6 opacity-30 mx-auto md:mx-0" />
              <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
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
