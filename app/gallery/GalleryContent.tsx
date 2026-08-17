"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { dayTheme } from "../lib/theme";
import { fetchGalleryItems, type GalleryItem } from "../lib/db-data";
import { GalleryCardSkeleton } from "../components/ui/skeleton-loader";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";

type ViewMode = "normal" | "maximized" | "fullscreen";

export function GalleryContent() {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("normal");

  const selectedImage = selectedIndex !== null ? galleryList[selectedIndex] : null;

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

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setViewMode("normal");
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setViewMode("normal");
  }, []);

  const goNext = useCallback(() => {
    if (selectedIndex === null || galleryList.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % galleryList.length);
  }, [selectedIndex, galleryList.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null || galleryList.length === 0) return;
    setSelectedIndex((selectedIndex - 1 + galleryList.length) % galleryList.length);
  }, [selectedIndex, galleryList.length]);

  const cycleViewMode = useCallback(() => {
    setViewMode((prev) => {
      if (prev === "normal") return "maximized";
      if (prev === "maximized") return "fullscreen";
      return "normal";
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "f":
        case "F":
          cycleViewMode();
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, closeLightbox, goNext, goPrev, cycleViewMode]);

  // Dynamic modal classes based on view mode
  const getModalContainerClass = () => {
    switch (viewMode) {
      case "fullscreen":
        return "fixed inset-0 z-[99999] flex items-center justify-center bg-black";
      case "maximized":
        return "fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-sm";
      default:
        return "fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm";
    }
  };

  const getModalContentClass = () => {
    switch (viewMode) {
      case "fullscreen":
        return "w-full h-full bg-black flex flex-col";
      case "maximized":
        return "w-full h-full max-w-[98vw] max-h-[98vh] bg-[rgba(13,27,42,0.98)] border-4 border-black flex flex-col shadow-[8px_8px_0px_#000]";
      default:
        return "max-w-4xl w-full bg-[rgba(13,27,42,0.95)] border-4 border-black flex flex-col shadow-[8px_8px_0px_#000]";
    }
  };

  const getImageContainerClass = () => {
    switch (viewMode) {
      case "fullscreen":
        return "relative flex-1 w-full overflow-hidden bg-black";
      case "maximized":
        return "relative flex-1 w-full overflow-hidden bg-black border-t-2 border-b-2 border-black";
      default:
        return "relative aspect-video w-full overflow-hidden border-2 border-black bg-black";
    }
  };

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
                onClick={() => openLightbox(index)}
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

      {/* Enhanced Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
            className={getModalContainerClass()}
          >
            <motion.div
              key={`lightbox-content-${viewMode}`}
              initial={{ scale: viewMode === "fullscreen" ? 1 : 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={getModalContentClass()}
            >
              {/* Window Title Bar */}
              <div
                className="flex justify-between items-center px-4 py-3 border-b-2 border-black shrink-0"
                style={{
                  background: viewMode === "fullscreen"
                    ? "rgba(0,0,0,0.9)"
                    : "rgba(13,27,42,0.95)",
                }}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h2
                    className="pixel-text text-xs md:text-sm truncate"
                    style={{ color: dayTheme.colors.coin }}
                  >
                    {selectedImage.title}
                  </h2>
                  {selectedImage.date && viewMode !== "fullscreen" && (
                    <p className="text-[10px] text-green-400 font-mono mt-0.5">
                      📅 {selectedImage.date}
                    </p>
                  )}
                </div>

                {/* Window Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Navigation counter */}
                  {galleryList.length > 1 && (
                    <span className="text-[10px] font-mono text-gray-400 mr-2 hidden md:inline">
                      {(selectedIndex ?? 0) + 1}/{galleryList.length}
                    </span>
                  )}

                  {/* MIN button */}
                  <button
                    onClick={() => setViewMode("normal")}
                    className="w-7 h-7 flex items-center justify-center border-2 border-black text-[10px] font-bold transition-colors"
                    style={{
                      backgroundColor: viewMode === "normal" ? dayTheme.colors.pipe : "rgba(30,50,70,0.8)",
                      color: viewMode === "normal" ? "#000" : "#fff",
                    }}
                    title="Normal view"
                  >
                    ▬
                  </button>

                  {/* MAX button */}
                  <button
                    onClick={() => setViewMode("maximized")}
                    className="w-7 h-7 flex items-center justify-center border-2 border-black text-[10px] font-bold transition-colors"
                    style={{
                      backgroundColor: viewMode === "maximized" ? dayTheme.colors.coin : "rgba(30,50,70,0.8)",
                      color: viewMode === "maximized" ? "#000" : "#fff",
                    }}
                    title="Maximize"
                  >
                    ◻
                  </button>

                  {/* FULL button */}
                  <button
                    onClick={() => setViewMode("fullscreen")}
                    className="w-7 h-7 flex items-center justify-center border-2 border-black text-[10px] font-bold transition-colors"
                    style={{
                      backgroundColor: viewMode === "fullscreen" ? dayTheme.colors.coin : "rgba(30,50,70,0.8)",
                      color: viewMode === "fullscreen" ? "#000" : "#fff",
                    }}
                    title="Fullscreen (F)"
                  >
                    ⛶
                  </button>

                  {/* CLOSE button */}
                  <button
                    onClick={closeLightbox}
                    className="w-7 h-7 flex items-center justify-center border-2 border-black text-[10px] font-bold transition-colors"
                    style={{ backgroundColor: dayTheme.colors.mario, color: "#fff" }}
                    title="Close (Esc)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Image Area */}
              <div className={getImageContainerClass()}>
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                  priority
                />

                {/* Navigation Arrows */}
                {galleryList.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/70 border-2 border-black text-white text-lg md:text-xl font-bold hover:bg-black/90 transition-colors"
                      title="Previous (←)"
                    >
                      ◀
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/70 border-2 border-black text-white text-lg md:text-xl font-bold hover:bg-black/90 transition-colors"
                      title="Next (→)"
                    >
                      ▶
                    </button>
                  </>
                )}

                {/* Mobile counter */}
                {galleryList.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 border border-black text-[10px] font-mono text-white md:hidden">
                    {(selectedIndex ?? 0) + 1} / {galleryList.length}
                  </div>
                )}
              </div>

              {/* Description bar (hidden in fullscreen) */}
              {viewMode !== "fullscreen" && selectedImage.description && (
                <div className="px-4 py-3 border-t-2 border-black shrink-0">
                  <p className="text-xs md:text-sm text-gray-200 font-sans leading-relaxed">
                    {selectedImage.description}
                  </p>
                </div>
              )}

              {/* Keyboard hint (normal mode only) */}
              {viewMode === "normal" && (
                <div className="px-4 py-2 border-t border-slate-800 shrink-0 hidden md:flex items-center justify-center gap-6 text-[9px] font-mono text-gray-500">
                  <span>← → Navigate</span>
                  <span>F Fullscreen</span>
                  <span>ESC Close</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
