import { CheckCircle, Target, UserCheck, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: CheckCircle,
    title: "Clarity in Concepts",
    description: "Not just notes, but deep understanding."
  },
  {
    icon: Target,
    title: "Exam-Oriented",
    description: "Focus on what matters for competitive exams."
  },
  {
    icon: UserCheck,
    title: "Expert Guidance",
    description: "Learn directly from a practicing advocate & mentor."
  },
  {
    icon: ClipboardCheck,
    title: "Evaluation & Personalized Feedback",
    description: "Regular assignments, mock tests, and expert feedback help you monitor progress, improve performance, and gain confidence for exams."
  }
];

const WhyAttend = () => {
  return (
    <section className="py-16 bg-accent/50">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-black leading-tight">
            Why Attend Our Sessions?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="book-card p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAttend;