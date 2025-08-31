"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Brain, Zap, Target } from "lucide-react";

interface FeatureCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  capabilities: string[];
}

const features: FeatureCard[] = [
  {
    id: "intelligence",
    icon: Brain,
    title: "Neural Intelligence",
    description: "Advanced cognitive processing that evolves with your workflow patterns and decision-making style.",
    capabilities: ["Predictive analysis", "Pattern recognition", "Adaptive learning", "Context awareness"]
  },
  {
    id: "performance", 
    icon: Zap,
    title: "Quantum Speed",
    description: "Instantaneous response times with parallel processing across multiple cognitive domains.",
    capabilities: ["Real-time optimization", "Parallel processing", "Zero-latency decisions", "Instant deployment"]
  },
  {
    id: "precision",
    icon: Target, 
    title: "Surgical Precision",
    description: "Exact solutions tailored to your specific objectives with minimal resource consumption.",
    capabilities: ["Targeted outcomes", "Resource optimization", "Error elimination", "Perfect calibration"]
  }
];

export default function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent, index: number) => {
    if (prefersReducedMotion) return;
    
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (event.clientY - centerY) / rect.height * -8;
    const rotateY = (event.clientX - centerX) / rect.width * 8;
    
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
    
    card.style.transform = `
      perspective(1000px) 
      rotateX(${Math.max(-10, Math.min(10, rotateX))}deg) 
      rotateY(${Math.max(-10, Math.min(10, rotateY))}deg) 
      translateZ(20px)
      scale(1.02)
    `;
  }, [prefersReducedMotion, mouseX, mouseY]);

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    
    card.style.transform = '';
    setHoveredCard(null);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-40 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-6">
            Core <span className="text-primary text-glow-mint">Capabilities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Three fundamental pillars of cognitive enhancement, engineered for unprecedented performance
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === index;
            const delay = 0.4 + index * 0.2;

            return (
              <motion.div
                key={feature.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="group relative"
                initial={{ opacity: 0, y: 100 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ 
                  duration: 1.2, 
                  delay,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                {/* Main Card */}
                <div 
                  className={`
                    relative h-[500px] glass rounded-3xl p-8 transition-all duration-700 ease-out
                    border border-border/50 backdrop-blur-xl
                    ${isHovered ? 'border-primary/30 shadow-2xl shadow-primary/10' : ''}
                  `}
                >
                  {/* Glow Effect */}
                  <div 
                    className={`
                      absolute inset-0 rounded-3xl transition-opacity duration-700
                      bg-gradient-to-br from-primary/5 via-transparent to-primary/10
                      ${isHovered ? 'opacity-100' : 'opacity-0'}
                    `}
                  />
                  
                  {/* Inner rim glow */}
                  <div 
                    className={`
                      absolute inset-0 rounded-3xl transition-opacity duration-500
                      ring-1 ring-inset ring-primary/20
                      ${isHovered ? 'opacity-100' : 'opacity-0'}
                    `}
                  />

                  {/* Card Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div 
                      className="mb-8"
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div 
                        className={`
                          w-16 h-16 rounded-2xl glass-mint flex items-center justify-center
                          transition-all duration-500 ease-out
                          ${isHovered ? 'scale-110 glow-mint' : ''}
                        `}
                      >
                        <Icon 
                          className={`
                            w-8 h-8 text-primary transition-all duration-500
                            ${isHovered ? 'text-white drop-shadow-[0_0_12px_rgba(37,244,223,0.8)]' : 'drop-shadow-[0_0_6px_rgba(37,244,223,0.4)]'}
                          `} 
                        />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-heading font-bold text-white mb-4 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-8 flex-grow font-light">
                      {feature.description}
                    </p>

                    {/* Capabilities List */}
                    <div className="space-y-3">
                      {feature.capabilities.map((capability, capIndex) => (
                        <motion.div
                          key={capability}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: delay + 0.3 + capIndex * 0.1 
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary glow-mint" />
                          <span className="text-sm text-muted-foreground font-medium tracking-wide">
                            {capability}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Hover reveal */}
                    <motion.div 
                      className={`
                        mt-6 pt-6 border-t border-primary/20 transition-all duration-500
                        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                      `}
                    >
                      <button className="text-primary hover:text-white transition-colors duration-300 font-medium font-heading tracking-wide">
                        Deploy System →
                      </button>
                    </motion.div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-6 left-6 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
                  <div className="absolute top-6 right-6 w-6 h-6 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
                  <div className="absolute bottom-6 left-6 w-6 h-6 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
                  <div className="absolute bottom-6 right-6 w-6 h-6 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
                </div>

                {/* Floating particles on hover */}
                {isHovered && !prefersReducedMotion && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-primary/60"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          y: [-10, -30, -10],
                          opacity: [0.6, 1, 0.6],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}