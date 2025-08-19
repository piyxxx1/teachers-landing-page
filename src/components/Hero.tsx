import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Video } from "lucide-react";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen gradient-hero hero-glow overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/2b76a1dd-7abe-4465-ba29-d5660cc0d79c.png" 
            alt="JLT Academy Logo" 
            className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-hero object-cover"
          />
        </div>
        
        <div className="flex items-center space-x-6 md:space-x-8">
          <button 
            onClick={() => scrollToSection('home')} 
            className="nav-link hidden md:block"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('courses')} 
            className="nav-link flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:block">Live Interactive Masterclass</span>
          </button>
          <button 
            onClick={() => scrollToSection('webinars')} 
            className="nav-link flex items-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span className="hidden md:block">Webinars</span>
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="nav-link hidden md:block"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="nav-link hidden md:block"
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-8 pt-10 pb-32">
        {/* Lead Educator Profile */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            {/* Educator Image */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-hero border-4 border-primary/30">
                <img 
                  src="/lovable-uploads/cb2f6ffc-195a-4d19-a086-e47ef4f3b2b3.png" 
                  alt="Lead Educator - Expert Legal Professional" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Educator Info */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Lead Educator</h2>
              <div className="text-lg md:text-xl text-primary font-semibold mb-4">BCOM, MCOM, LLB</div>
              
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <div className="bg-primary/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/30">
                  <div className="text-2xl md:text-3xl font-bold text-primary">15+</div>
                  <div className="text-sm text-gray-300">Years Experience</div>
                </div>
              </div>

              <p className="text-gray-300 max-w-lg leading-relaxed">
                Guiding law aspirants with the right strategy, clear concepts, and confidence to thrive in the legal field.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => scrollToSection('courses')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-card"
            >
              <span className="hidden sm:inline">Explore Live Interactive Masterclass</span>
              <span className="sm:hidden">Explore Masterclass</span>
            </Button>
            <Button 
              onClick={() => scrollToSection('about')}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">15+</div>
            <div className="text-gray-300">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">1000+</div>
            <div className="text-gray-300">Students Trained</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">10+</div>
            <div className="text-gray-300">Expert Live Interactive Masterclass</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;