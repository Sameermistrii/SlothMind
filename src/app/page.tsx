import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import FooterSection from "@/components/FooterSection";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="relative">
        {/* Hero Section - Full viewport height */}
        <HeroSection className="relative z-10" />
        
        {/* Main content container with consistent spacing */}
        <div className="relative z-20 bg-[#0a0a0a]">
          {/* About Section */}
          <AboutSection />
          
          {/* Features Section */}
          <FeaturesSection />
          
          {/* Footer Section */}
          <FooterSection />
        </div>
      </div>
    </main>
  );
}