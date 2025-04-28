import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface PackageGalleryProps {
  images: string[];
  alt: string;
}

export function PackageGallery({ images, alt }: PackageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Reset loading state when image changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentImageIndex]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swiped left
      nextImage();
    } else if (touchEnd - touchStart > 100) {
      // Swiped right
      prevImage();
    }
  };

  // Keyboard navigation in fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Use fallback image if array is empty
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop" 
          alt="Destination" 
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="h-full w-full"
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          <LazyLoadImage
            src={images[currentImageIndex]}
            alt={`${alt} - Image ${currentImageIndex + 1}`}
            effect="blur"
            className="h-full w-full object-cover object-center transition-opacity duration-300"
            afterLoad={handleImageLoad}
          />
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="absolute right-4 top-4 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Toggle fullscreen"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {images.slice(0, 6).map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`aspect-square overflow-hidden rounded-md ${
              currentImageIndex === index
                ? 'ring-2 ring-primary'
                : 'ring-1 ring-gray-200'
            }`}
          >
            <LazyLoadImage
              src={image}
              alt={`Thumbnail ${index + 1}`}
              effect="blur"
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={toggleFullscreen}
          >
            <button
              onClick={toggleFullscreen}
              className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Close fullscreen"
            >
              <X className="h-6 w-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentImageIndex]}
                alt={`${alt} - Image ${currentImageIndex + 1} (Fullscreen)`}
                className="h-full w-full object-contain"
              />

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                aria-label="Previous image (fullscreen)"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                aria-label="Next image (fullscreen)"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Fullscreen thumbnails */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full ${
                      currentImageIndex === index
                        ? 'bg-white'
                        : 'bg-white/40'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 