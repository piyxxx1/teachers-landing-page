import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Facebook, Linkedin, Instagram, Heart } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-6 md:px-8">
        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-secondary-foreground/80 leading-relaxed">
                    Behind Jagtap Patil Petrol Pump,<br />
                    Opposite Military Ground,<br />
                    Pune 411061
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+917248926070" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                    +91 7248926070
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:contact@jltacademy.com" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                    contact@jltacademy.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <div className="p-1 rounded-full" style={{ backgroundColor: '#ffe4c4' }}>
                  <Button variant="ghost" size="icon" className="text-black hover:text-black hover:bg-transparent focus:bg-transparent active:bg-transparent">
                    <Linkedin className="w-2 h-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Contact Form */}
          <div>
            <Card className="p-8 bg-card border-0">
              <h3 className="text-2xl font-bold text-card-foreground mb-6">Quick Links</h3>
              
              <div className="space-y-3 mb-8">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-card-foreground hover:text-primary hover:bg-transparent p-0 h-auto"
                  onClick={() => scrollToSection('home')}
                >
                  Home
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-card-foreground hover:text-primary hover:bg-transparent p-0 h-auto"
                  onClick={() => scrollToSection('courses')}
                >
                  Live Interactive Masterclass
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-card-foreground hover:text-primary hover:bg-transparent p-0 h-auto"
                  onClick={() => scrollToSection('webinars')}
                >
                  Webinars
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-card-foreground hover:text-primary hover:bg-transparent p-0 h-auto"
                  onClick={() => scrollToSection('about')}
                >
                  About
                </Button>
              </div>

              <div className="bg-accent p-6 rounded-lg border-0">
                <h4 className="font-semibold text-accent-foreground mb-3">Ready to Start?</h4>
                <p className="text-sm text-accent-foreground/80 mb-4">
                  Begin your legal journey today—transform ambition into action.
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => scrollToSection('courses')}
                >
                  Explore Masterclass
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/2b76a1dd-7abe-4465-ba29-d5660cc0d79c.png" 
                alt="JLT Academy Logo" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xl font-bold">JLT Academy</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-secondary-foreground/60 text-sm">
                © 2024 JLT Academy. All rights reserved.
              </p>
              <p className="text-secondary-foreground/60 text-sm">
                Empowering Legal Minds Since 2009
              </p>
            </div>
          </div>
          
          {/* Watermark */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2 text-secondary-foreground/40 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by Qikk Space</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;