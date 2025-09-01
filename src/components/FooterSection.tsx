"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";

export default function FooterSection() {
  const [isActivated, setIsActivated] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCtaClick = () => {
    if (!isActivated) {
      setShowEmailForm(true);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address", {
        style: {
          background: "rgba(15, 15, 15, 0.95)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#ffffff"
        }
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting email:', email);
      
      // Store email using App Router API
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setIsActivated(true);
        setShowEmailForm(false);
        toast.success("Successfully joined waiting list!", {
          description: "We'll notify you when SlothMind is ready.",
          style: {
            background: "rgba(15, 15, 15, 0.95)",
            border: "1px solid rgba(37, 244, 223, 0.3)",
            color: "#ffffff"
          }
        });
      } else {
        throw new Error(`Failed to store email: ${responseData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to join waiting list. Please try again.", {
        style: {
          background: "rgba(15, 15, 15, 0.95)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#ffffff"
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://x.com/Slothmindin",
      ariaLabel: "Follow SlothMind on Twitter"
    },
    {
      name: "Instagram", 
      icon: Instagram,
      href: "https://www.instagram.com/slothmind.in/",
      ariaLabel: "Follow SlothMind on Instagram"
    },
    {
      name: "LinkedIn",
      icon: Linkedin, 
      href: "https://www.linkedin.com/in/slothmind/",
      ariaLabel: "Connect with SlothMind on LinkedIn"
    }
  ];

  return (
    <footer className="relative w-full py-32 px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37, 244, 223, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 244, 223, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          className="flex flex-col items-center gap-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-20%" }}
        >
          {/* Main CTA */}
          <motion.div className="space-y-8">
            <motion.h3 
              className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to transcend?
            </motion.h3>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8 font-light max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join the cognitive revolution. Your AI personal operator awaits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {!showEmailForm ? (
                <Button
                  onClick={handleCtaClick}
                  className={`
                    relative glass-mint text-white px-10 py-4 text-lg font-medium rounded-full 
                    transition-all duration-700 ease-out font-heading tracking-wide
                    hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 
                    focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 
                    focus:ring-offset-background group overflow-hidden
                    ${isActivated ? 'cursor-default opacity-75' : 'cursor-pointer'}
                  `}
                  disabled={isActivated}
                >
                  <span className="relative z-10">
                    {isActivated ? "See Around" : "Join Waiting List"}
                  </span>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  {/* Success state glow */}
                  {isActivated && (
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </Button>
              ) : (
                <motion.div 
                  className="space-y-4 w-full max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your Gmail address"
                      className="w-full px-6 py-4 bg-black/50 border border-primary/30 rounded-full text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleEmailSubmit}
                      disabled={isSubmitting || !email}
                      className="flex-1 glass-mint text-white px-6 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background font-heading tracking-wide"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    <Button
                      onClick={() => setShowEmailForm(false)}
                      variant="outline"
                      className="px-6 py-4 text-lg font-medium rounded-full border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 font-heading tracking-wide"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className={`
                  group relative p-4 rounded-2xl transition-all duration-500 ease-out
                  text-muted-foreground hover:text-primary glass
                  hover:scale-110 hover:shadow-lg hover:shadow-primary/10
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                  focus:ring-offset-background
                `}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <social.icon className="w-6 h-6" />
                
                {/* Hover glow */}
                <div 
                  className={`
                    absolute inset-0 rounded-2xl bg-primary/5 blur-sm
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  `} 
                />
                
                {/* Corner accents */}
                <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-primary/20 rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-primary/20 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            ))}
          </motion.div>

          {/* Minimal footer text */}
          <motion.div 
            className="pt-16 border-t border-border/20 w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground/60">
              <p className="font-light">
                © 2025 SlothMind. Your AI Operator.
              </p>
              
              <div className="flex items-center gap-8">
                <a 
                  href="/privacy" 
                  className="hover:text-primary transition-colors duration-300 font-light"
                >
                  Privacy
                </a>
                <a 
                  href="/terms" 
                  className="hover:text-primary transition-colors duration-300 font-light"
                >
                  Terms
                </a>
                <a 
                  href="/contact" 
                  className="hover:text-primary transition-colors duration-300 font-light"
                >
                  Contact
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
