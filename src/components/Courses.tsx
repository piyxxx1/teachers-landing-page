import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Scale, FileText, Users } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "All India Bar Examination (AIBE)",
    description: "Comprehensive preparation for AIBE with expert guidance, practice papers, and strategic study plans.",
    icon: Scale,
    duration: "3 Months",
    level: "Professional"
  },
  {
    id: 2,
    title: "Legal Drafting",
    description: "Master the art of legal document preparation, contracts, and professional legal writing.",
    icon: FileText,
    duration: "2 Months",
    level: "Intermediate"
  },
  {
    id: 3,
    title: "Judgement Writing",
    description: "Develop skills in judicial decision writing, legal reasoning, and case analysis.",
    icon: BookOpen,
    duration: "6 Weeks",
    level: "Advanced"
  },
  {
    id: 4,
    title: "Combo Masterclass",
    description: "Complete coverage of Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA).",
    icon: Users,
    duration: "4 Months",
    level: "Comprehensive",
    featured: true
  }
];

const Courses = () => {
  return (
    <section id="courses" className="py-20 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-gold bg-clip-text text-transparent">Live Interactive Masterclass</span>
          </h2>
          <p className="text-3xl font-bold text-center max-w-4xl mx-auto leading-relaxed">
            Strengthen your legal foundation and prepare for competitive exams with expert-led live sessions. From preparation to profession—step into your legal journey today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {courses.map((course) => (
            <Card key={course.id} className={`book-card p-8 h-full ${course.featured ? 'lg:col-span-2' : ''}`}>
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                    <course.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{course.title}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded">
                        {course.duration}
                      </span>
                      <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded">
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                  {course.description}
                </p>

                {course.featured && (
                  <div className="mb-4 p-4 bg-accent rounded-lg">
                    <h4 className="font-semibold text-accent-foreground mb-2">Includes:</h4>
                    <ul className="text-sm text-accent-foreground space-y-1">
                      <li>• Bharatiya Nyaya Sanhita (BNS), 2023</li>
                      <li>• Bharatiya Nagarik Suraksha Sanhita (BNSS)</li>
                      <li>• Bharatiya Sakshya Adhiniyam (BSA)</li>
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Expert Instruction</span>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Live Interactive Masterclass
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Courses;