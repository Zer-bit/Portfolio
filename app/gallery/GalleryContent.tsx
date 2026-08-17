"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { dayTheme } from "../lib/theme";
import { fetchGalleryItems, type GalleryItem } from "../lib/db-data";
import { GalleryCardSkeleton } from "../components/ui/skeleton-loader";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";

export function GalleryContent() {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchGalleryItems().then((data) => {
      if (isMounted) {
        setGalleryList(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 pt-12">
      {/* Page heading */}
      <div className="mb-12 text-center">
        <h1
          className="pixel-text text-lg md:text-2xl"
          style={{ color: dayTheme.colors.coin }}
        >
          PHOTO GALLERY
        </h1>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <GalleryCardSkeleton key={idx} />
            ))
          : galleryList.map((item, index) => (
              <motion.div
                key={item.id || `${item.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                onClick={() => setSelectedImage(item)}
                className="cursor-pointer group"
              >
                <PixelCard
                  variant="elevated"
                  className="h-full flex flex-col justify-between p-4 space-y-4 transition-transform duration-200 group-hover:-translate-y-1"
                >
                  {/* Image container */}
                  <div className="aspect-video relative overflow-hidden bg-slate-900 border-2 border-black">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info section */}
                  <div className="space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      {item.date && (
                        <span
                          className="inline-block text-[10px] font-mono px-2 py-0.5 mb-2 font-bold uppercase border border-black"
                          style={{
                            backgroundColor: `${dayTheme.colors.pipe}33`,
                            color: dayTheme.colors.pipe,
                          }}
                        >
                          📅 {item.date}
                        </span>
                      )}
                      <h3
                        className="pixel-text text-sm font-bold leading-tight"
                        style={{ color: dayTheme.colors.coin }}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </PixelCard>
              </motion.div>
            ))}
      </div>

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-[rgba(13,27,42,0.95)] border-4 border-black p-6 space-y-4 shadow-[8px_8px_0px_#000]"
            >
              <div className="flex justify-between items-center border-b-2 border-black pb-3">
                <div>
                  <h2 className="pixel-text text-base md:text-lg" style={{ color: dayTheme.colors.coin }}>
                    {selectedImage.title}
                  </h2>
                  {selectedImage.date && (
                    <p className="text-xs text-green-400 font-mono mt-1">📅 {selectedImage.date}</p>
                  )}
                </div>
                <PixelButton variant="brick" size="sm" onClick={() => setSelectedImage(null)}>
                  CLOSE ✕
                </PixelButton>
              </div>

              <div className="relative aspect-video w-full overflow-hidden border-2 border-black bg-black">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                />
              </div>

              {selectedImage.description && (
                <p className="text-sm text-gray-200 font-sans leading-relaxed pt-2">
                  {selectedImage.description}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
