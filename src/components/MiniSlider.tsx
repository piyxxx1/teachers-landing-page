import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const MiniSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 1,
      src: "/lovable-uploads/slider/1.jpg",
      alt: "Slider Image 1",
      type: "image"
    },
    {
      id: 2,
      src: "/lovable-uploads/slider/2.jpg",
      alt: "Slider Image 2",
      type: "image"
    },
    {
      id: 3,
      src: "/lovable-uploads/slider/3.mp4",
      alt: "Slider Video 3",
      type: "video"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    nextSlide();
  };

  // Handle auto-advance based on content type
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const currentSlideData = slides[currentSlide];

    if (currentSlideData.type === "image") {
      // For images, use 3-second timer
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
         } else if (currentSlideData.type === "video" && videoRef.current) {
       // For videos, listen to the 'ended' event
       const video = videoRef.current;
       
       video.addEventListener('ended', handleVideoEnd);
       
       return () => {
         video.removeEventListener('ended', handleVideoEnd);
       };
     }

         return () => {
       if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
       }
     };

     // Reset video playing state when slide changes
     if (currentSlideData.type === "image") {
       setIsVideoPlaying(false);
     }


   }, [currentSlide]);

  return (
         <section className="py-8 bg-background">
       <div className="container mx-auto px-6 md:px-8">
         <div className="max-w-2xl mx-auto">
           <Card className="relative overflow-hidden rounded-lg shadow-lg">
             {/* Slides */}
             <div className="relative h-80 md:h-96">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                                     {slide.type === "image" ? (
                     <img
                       src={slide.src}
                       alt={slide.alt}
                       className="w-full h-full object-contain"
                     />
                                       ) : (
                      <div className="relative w-full h-full">
                        <video
                          ref={videoRef}
                          src={slide.src}
                          className="w-full h-full object-contain"
                          muted
                          playsInline
                        />
                        {!isVideoPlaying && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <button
                              onClick={handleVideoPlay}
                              className="bg-white/90 hover:bg-white text-black p-4 rounded-full transition-all duration-300 hover:scale-110"
                            >
                              <Play className="w-8 h-8 ml-1" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MiniSlider;
