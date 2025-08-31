"use client";

import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageTrailItem {
  id: number;
  src: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
}

interface ImageCursorTrailProps {
  items: string[];
  maxNumberOfImages?: number;
  distance?: number;
  imgClass?: string;
  className?: string;
  children: ReactNode;
}

export const ImageCursorTrail: React.FC<ImageCursorTrailProps> = ({
  items,
  maxNumberOfImages = 6,
  distance = 80,
  imgClass = "",
  className = "",
  children
}) => {
  const [images, setImages] = useState<ImageTrailItem[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef(0);
  const imageIdCounter = useRef(0);
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Animation loop for image positioning and lifecycle
  const updateImages = useCallback((timestamp: number) => {
    if (timestamp - lastUpdateTimeRef.current < 16) { // ~60fps throttle
      animationFrameRef.current = requestAnimationFrame(updateImages);
      return;
    }
    
    lastUpdateTimeRef.current = timestamp;

    setImages(prevImages => {
      if (!isMouseInside || prefersReducedMotion.current) {
        return prevImages.filter(img => img.opacity > 0.1)
          .map(img => ({ ...img, opacity: img.opacity * 0.95 }));
      }

      // Add new image if we haven't reached the limit and mouse is moving
      const shouldAddImage = prevImages.length < maxNumberOfImages && 
                             Math.random() < 0.3; // 30% chance per frame

      let newImages = [...prevImages];

      if (shouldAddImage && items.length > 0) {
        const randomImage = items[Math.floor(Math.random() * items.length)];
        const angle = Math.random() * Math.PI * 2;
        const radius = distance * (0.5 + Math.random() * 0.5); // 50-100% of distance
        
        newImages.push({
          id: imageIdCounter.current++,
          src: randomImage,
          x: mousePos.x + Math.cos(angle) * radius,
          y: mousePos.y + Math.sin(angle) * radius,
          opacity: 0.8,
          scale: 0.3 + Math.random() * 0.4, // 0.3 to 0.7
          rotation: (Math.random() - 0.5) * 30 // -15 to 15 degrees
        });
      }

      // Update existing images - fade out and slight movement
      return newImages
        .map(img => ({
          ...img,
          opacity: img.opacity * 0.98,
          scale: img.scale * 0.995,
          y: img.y - 0.5, // Slight upward drift
          rotation: img.rotation + (Math.random() - 0.5) * 0.5
        }))
        .filter(img => img.opacity > 0.05); // Remove fully faded images
    });

    animationFrameRef.current = requestAnimationFrame(updateImages);
  }, [isMouseInside, mousePos, distance, maxNumberOfImages, items]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  // Mouse enter/leave handlers
  const handleMouseEnter = useCallback(() => {
    setIsMouseInside(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseInside(false);
  }, []);

  // Set up event listeners and animation loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(updateImages);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, updateImages]);

  // Clear images when items change
  useEffect(() => {
    setImages([]);
  }, [items]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ cursor: isMouseInside ? 'none' : 'auto' }}
    >
      {children}
      
      {/* Image trail overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{
                opacity: image.opacity,
                scale: image.scale,
                x: image.x - 32, // Center the 64px image
                y: image.y - 32,
                rotate: image.rotation
              }}
              exit={{ opacity: 0, scale: 0.1 }}
              transition={{
                duration: 0.2,
                ease: "easeOut"
              }}
              className="absolute"
              style={{
                willChange: 'transform, opacity'
              }}
            >
              <img
                src={image.src}
                alt=""
                className={`
                  w-16 h-16 object-cover rounded-lg shadow-lg
                  ring-1 ring-white/10 backdrop-blur-sm
                  ${imgClass}
                `}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(46, 211, 183, 0.3))',
                  boxShadow: `
                    0 4px 20px rgba(0, 0, 0, 0.3),
                    0 0 20px rgba(46, 211, 183, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `
                }}
                draggable={false}
                onError={(e) => {
                  // Hide broken images
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};