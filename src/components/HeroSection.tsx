"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Check capabilities and preferences
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    setHasWebGL(!!gl);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  // Advanced neural mesh rendering
  const initializeNeuralMesh = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();

    // Neural network configuration
    const nodes: Array<{
      x: number;y: number;z: number;
      originalX: number;originalY: number;originalZ: number;
      vx: number;vy: number;vz: number;
      pulse: number;pulseSpeed: number;
      size: number;
    }> = [];

    const connections: Array<{
      from: number;to: number;
      strength: number;originalStrength: number;
      pulse: number;
    }> = [];

    // Initialize nodes in 3D space
    const nodeCount = 32;
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * canvas.offsetWidth * 1.2;
      const y = (Math.random() - 0.5) * canvas.offsetHeight * 1.2;
      const z = (Math.random() - 0.5) * 300;

      nodes.push({
        x, y, z,
        originalX: x, originalY: y, originalZ: z,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.01,
        size: 2 + Math.random() * 3
      });
    }

    // Create intelligent connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2) +
          Math.pow(nodes[i].z - nodes[j].z, 2)
        );

        if (distance < 200 && Math.random() > 0.7) {
          const strength = (1 - distance / 200) * (0.3 + Math.random() * 0.4);
          connections.push({
            from: i,
            to: j,
            strength,
            originalStrength: strength,
            pulse: Math.random() * Math.PI * 2
          });
        }
      }
    }

    let time = 0;
    const animate = () => {
      if (prefersReducedMotion && time === 0) {
        renderMesh(0);
        return;
      }

      if (!prefersReducedMotion) {
        time += 0.004;
        renderMesh(time);
        animationId = requestAnimationFrame(animate);
      }
    };

    const renderMesh = (currentTime: number) => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Apply mouse influence
      const mouseInfluence = prefersReducedMotion ? 0 : 0.00005;
      const parallaxX = mousePosition.x * mouseInfluence * rect.width;
      const parallaxY = mousePosition.y * mouseInfluence * rect.height;

      // Update nodes with organic motion
      nodes.forEach((node, i) => {
        if (!prefersReducedMotion) {
          // Organic floating with mouse influence
          const floatX = Math.sin(currentTime * 0.5 + i * 0.8) * 15;
          const floatY = Math.cos(currentTime * 0.3 + i * 0.6) * 12;
          const floatZ = Math.sin(currentTime * 0.4 + i * 0.9) * 20;

          node.x = node.originalX + floatX + parallaxX * (1 + node.z * 0.001);
          node.y = node.originalY + floatY + parallaxY * (1 + node.z * 0.001);
          node.z = node.originalZ + floatZ;

          // Update pulse
          node.pulse += node.pulseSpeed;
        }
      });

      // Update connections
      connections.forEach((connection, i) => {
        if (!prefersReducedMotion) {
          connection.pulse += 0.015;
          const pulseFactor = Math.sin(connection.pulse) * 0.3 + 0.7;
          connection.strength = connection.originalStrength * pulseFactor;
        }
      });

      // Render connections with enhanced visuals
      connections.forEach((connection) => {
        const fromNode = nodes[connection.from];
        const toNode = nodes[connection.to];

        // 3D to 2D projection
        const perspective = 400;
        const fromX = fromNode.x * perspective / (perspective + fromNode.z) + rect.width / 2;
        const fromY = fromNode.y * perspective / (perspective + fromNode.z) + rect.height / 2;
        const toX = toNode.x * perspective / (perspective + toNode.z) + rect.width / 2;
        const toY = toNode.y * perspective / (perspective + toNode.z) + rect.height / 2;

        const avgPulse = (Math.sin(fromNode.pulse) + Math.sin(toNode.pulse)) / 2;
        const alpha = connection.strength * (0.2 + avgPulse * 0.3);

        // Main connection line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = `rgba(37, 244, 223, ${alpha})`;
        ctx.lineWidth = 1 + connection.strength;
        ctx.stroke();

        // Glow effect
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = `rgba(37, 244, 223, ${alpha * 0.3})`;
        ctx.lineWidth = 3 + connection.strength * 2;
        ctx.stroke();
      });

      // Render nodes with advanced effects
      nodes.forEach((node) => {
        const perspective = 400;
        const screenX = node.x * perspective / (perspective + node.z) + rect.width / 2;
        const screenY = node.y * perspective / (perspective + node.z) + rect.height / 2;

        const scale = perspective / (perspective + node.z);
        const radius = node.size * scale;
        const pulseIntensity = Math.sin(node.pulse) * 0.4 + 0.6;
        const alpha = 0.7 + pulseIntensity * 0.3;

        // Outer glow
        const outerGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * 6);
        outerGradient.addColorStop(0, `rgba(37, 244, 223, ${alpha * 0.1})`);
        outerGradient.addColorStop(1, 'rgba(37, 244, 223, 0)');

        ctx.beginPath();
        ctx.arc(screenX, screenY, radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = outerGradient;
        ctx.fill();

        // Inner glow
        const innerGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * 2);
        innerGradient.addColorStop(0, `rgba(37, 244, 223, ${alpha * 0.6})`);
        innerGradient.addColorStop(1, 'rgba(37, 244, 223, 0)');

        ctx.beginPath();
        ctx.arc(screenX, screenY, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = innerGradient;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 244, 223, ${alpha})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.fill();
      });
    };

    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [prefersReducedMotion, mousePosition]);

  // Initialize after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      initializeNeuralMesh();
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeNeuralMesh]);



  return (
    <motion.section
      ref={sectionRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      style={{ opacity: heroOpacity, scale: heroScale }}>

      {/* Neural Mesh Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 1.2s ease-out"
        }}
        aria-hidden="true" />


      {/* Ambient particles */}
      {!prefersReducedMotion &&
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) =>
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut"
          }} />

        )}
        </div>
      }

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center px-8 max-w-5xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isLoading ? 0 : 1,
          y: isLoading ? 50 : 0
        }}
        transition={{
          duration: 1.2,
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}>

        {/* Main Headline */}
        <motion.h1
          className="font-heading text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black text-white mb-8 leading-[0.8] tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}>

          <span className="inline-block text-glow-mint">
            SlothMind
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}>

          Your AI personal operator. Think faster, build smarter, transcend limitations.
        </motion.p>


      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}>

        <div className="w-6 h-12 border-2 border-primary/30 rounded-full flex justify-center glass">
          <motion.div
            className="w-1 h-4 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />

        </div>
      </motion.div>
    </motion.section>);

}