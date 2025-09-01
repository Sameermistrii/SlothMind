"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const meshOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.3]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    const drawGradientMesh = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Advanced gradient mesh system
      const gridSize = 60;
      const cols = Math.ceil(width / gridSize) + 3;
      const rows = Math.ceil(height / gridSize) + 3;

      // Create flowing mesh points
      const points: Array<{x: number, y: number, intensity: number}> = [];
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * gridSize - gridSize;
          const baseY = j * gridSize - gridSize;

          // Complex wave motion
          const waveX = Math.sin((baseX + time) * 0.008) * 25 + Math.cos((baseY + time) * 0.006) * 15;
          const waveY = Math.cos((baseY + time) * 0.007) * 20 + Math.sin((baseX + time) * 0.005) * 12;

          const x = baseX + waveX;
          const y = baseY + waveY;
          
          // Dynamic intensity based on position and time
          const centerX = width / 2;
          const centerY = height / 2;
          const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const maxDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
          
          const intensity = (1 - distanceFromCenter / maxDistance) * 
                           (0.3 + Math.sin(time * 0.003 + i * 0.2 + j * 0.15) * 0.4);

          points.push({ x, y, intensity: Math.max(0, intensity) });
        }
      }

      // Render gradient fields
      points.forEach((point, index) => {
        if (point.intensity <= 0) return;

        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, gridSize * 1.8
        );

        const alpha = point.intensity * 0.12;
        const mintIntensity = 0.4 + Math.sin(time * 0.002 + index * 0.1) * 0.3;

        gradient.addColorStop(0, `rgba(37, 244, 223, ${alpha * mintIntensity})`);
        gradient.addColorStop(0.4, `rgba(255, 255, 255, ${alpha * 0.15})`);
        gradient.addColorStop(1, "rgba(37, 244, 223, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(point.x - gridSize, point.y - gridSize, gridSize * 2, gridSize * 2);
      });

      // Render flowing mesh lines
      ctx.strokeStyle = `rgba(37, 244, 223, 0.08)`;
      ctx.lineWidth = 1;
      
      // Horizontal lines
      for (let j = 0; j < rows - 1; j++) {
        ctx.beginPath();
        let first = true;
        for (let i = 0; i < cols; i++) {
          const point = points[j * cols + i];
          if (point && point.intensity > 0.1) {
            if (first) {
              ctx.moveTo(point.x, point.y);
              first = false;
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let i = 0; i < cols - 1; i++) {
        ctx.beginPath();
        let first = true;
        for (let j = 0; j < rows; j++) {
          const point = points[j * cols + i];
          if (point && point.intensity > 0.1) {
            if (first) {
              ctx.moveTo(point.x, point.y);
              first = false;
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
        }
        ctx.stroke();
      }

      time += 12;
      animationId = requestAnimationFrame(drawGradientMesh);
    };

    resizeCanvas();
    if (!prefersReducedMotion) {
      drawGradientMesh();
    }

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-40 overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2 
            }}
            className="space-y-12"
          >
            <motion.h2 
              id="about-heading"
              className="font-heading text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Think beyond
              <br />
              <span className="text-primary text-glow-mint">human limits</span>
            </motion.h2>

            <motion.div 
              className="space-y-8 text-lg lg:text-xl leading-relaxed text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="font-light">
                SlothMind operates at the intersection of human intuition and machine precision. 
                Every decision amplified, every workflow optimized, every creative barrier dissolved.
              </p>

              <p className="font-light">
                Our neural architecture learns not just what you do, but how you think. 
                Anticipating needs before they arise, suggesting solutions before problems manifest.
              </p>

              <p className="font-light">
                This is cognitive augmentation for the next generation of builders and creators.
              </p>
            </motion.div>

            <motion.button
              className="inline-flex items-center gap-3 text-primary hover:text-white transition-all duration-500 group text-lg font-medium font-heading tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ x: 10 }}
            >
              <span>Explore capabilities</span>
              <ArrowRight 
                size={20} 
                className="transition-transform duration-300 group-hover:translate-x-2" 
              />
            </motion.button>
          </motion.div>

          {/* Right Column - Animated Gradient Mesh */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.4 
            }}
            style={{ y: parallaxY, opacity: meshOpacity }}
            className="relative"
          >
            <div className="relative aspect-square max-w-2xl mx-auto">
              {/* Glass container */}
              <div className="absolute inset-0 glass rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl" />
              </div>

              {/* Looping Video */}
              <video
                className="absolute inset-6 rounded-2xl object-cover"
                style={{ 
                  width: 'calc(100% - 3rem)',
                  height: 'calc(100% - 3rem)',
                  filter: "brightness(0.8) contrast(1.1)",
                  mixBlendMode: "screen"
                }}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/loop.mp4" type="video/mp4" />
                {/* Fallback to animated mesh if video fails to load */}
                {!prefersReducedMotion ? (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 rounded-2xl opacity-90"
                    style={{ 
                      filter: "blur(0.5px)",
                      mixBlendMode: "screen"
                    }}
                  />
                ) : (
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-60" 
                    style={{
                      background: `
                        radial-gradient(circle at 30% 30%, rgba(37, 244, 223, 0.15) 0%, transparent 60%),
                        radial-gradient(circle at 70% 70%, rgba(37, 244, 223, 0.1) 0%, transparent 60%),
                        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)
                      `
                    }}
                  />
                )}
              </video>

              {/* Subtle edge glow */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-primary/20" />
              
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/40 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/40 rounded-br-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}