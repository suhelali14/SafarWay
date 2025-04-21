import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  images: string[];
}

export function Gallery({ images }: GalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`Gallery image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
      
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`aspect-square rounded-md overflow-hidden ${
              currentImageIndex === index ? 'ring-2 ring-sky-500' : ''
            } hover:opacity-80 transition-opacity`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
} 