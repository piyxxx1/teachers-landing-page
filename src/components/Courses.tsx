import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Scale, FileText, Users } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "All India Bar Examination (AIBE)",
    description: "From law graduate to practicing advocate – AIBE is the bridge, we help you cross it",
    icon: Scale,
    duration: "3 Months",
    level: "Professional"
  },
  {
    id: 2,
    title: "Legal Drafting",
    description: "Master the art of legal document preparation, contracts, and professional legal writing.",
    icon: FileText,
    duration: "2 Months"
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
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight text-amber-900">
            Our Live Interactive Masterclass
          </h2>
          <p className="text-xl text-center max-w-4xl mx-auto leading-relaxed">
            Strengthen your legal foundation and prepare for competitive exams with expert-led live sessions. <span className="text-amber-900">From preparation to profession—step into your legal journey</span>
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

                <div className="flex items-center justify-center pt-4 border-t border-border">
                  <a 
                    href="https://forms.office.com/pages/responsepage.aspx?id=-m_t40LQXkKOX_MUbtltZBWEL52EmyhPjY4p8NtMoEBUNVdaTVVGMlVFWjdIUjQ1R01HWE5VQUxZUS4u&route=shorturl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                      Learn More
                    </Button>
                  </a>
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