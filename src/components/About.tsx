import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Award, BookOpen, Users, Target, Scale, FileText } from "lucide-react";
import { useState } from "react";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    userType: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  const specialties = [
    {
      icon: Scale,
      title: "Bar Examinations",
      description: "Comprehensive AIBE preparation and success strategies"
    },
    {
      icon: FileText,
      title: "Legal Drafting",
      description: "Professional document preparation and contract writing"
    },
    {
      icon: BookOpen,
      title: "Judicial Training",
      description: "Judgment writing and legal reasoning development"
    },
    {
      icon: Target,
      title: "Competitive Exams",
      description: "Strategic preparation for various legal competitive examinations"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-gold bg-clip-text text-transparent">JLT Academy</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              JLT Academy is a premier legal education institution dedicated to empowering the next generation 
              of legal professionals. With over 15 years of expertise in legal education and competitive 
              examination preparation, we provide comprehensive training in all aspects of legal practice.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Award className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">15+ Years</div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">1000+ Students</div>
                  <div className="text-sm text-muted-foreground">Successfully Trained</div>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Our academy specializes in bar examination preparation, legal drafting, judicial training, 
              and comprehensive coverage of the new Indian legal system including Bharatiya Nyaya Sanhita, 
              Bharatiya Nagarik Suraksha Sanhita, and Bharatiya Sakshya Adhiniyam.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="mt-20">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 shadow-card">
              <h3 className="text-3xl font-bold text-center mb-8">Reach us</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>I am a</Label>
                  <RadioGroup 
                    value={formData.userType} 
                    onValueChange={(value) => setFormData({...formData, userType: value})}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="law-student" id="law-student" />
                      <Label htmlFor="law-student">Law Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="judiciary-aspirant" id="judiciary-aspirant" />
                      <Label htmlFor="judiciary-aspirant">Judiciary Aspirant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="law-graduate" id="law-graduate" />
                      <Label htmlFor="law-graduate">Law Graduate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="practicing-advocate" id="practicing-advocate" />
                      <Label htmlFor="practicing-advocate">Practicing Advocate</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full">
                  Register Now
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Specialties */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">Our Specialties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {specialties.map((specialty, index) => (
              <Card key={index} className="p-6 text-center shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <specialty.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{specialty.title}</h4>
                <p className="text-sm text-muted-foreground">{specialty.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;