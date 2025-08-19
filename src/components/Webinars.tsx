import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Users, Play } from "lucide-react";

const webinars = [
  {
    id: 1,
    title: "New Criminal Laws 2024: Complete Overview",
    date: "March 25, 2024",
    time: "6:00 PM IST",
    duration: "2 hours",
    attendees: "150+",
    description: "Comprehensive analysis of the new Bharatiya Nyaya Sanhita and its implications for legal practice.",
    status: "upcoming"
  },
  {
    id: 2,
    title: "AIBE Success Strategies",
    date: "March 20, 2024",
    time: "7:00 PM IST",
    duration: "1.5 hours",
    attendees: "200+",
    description: "Expert tips and preparation strategies for cracking the All India Bar Examination.",
    status: "completed"
  },
  {
    id: 3,
    title: "Legal Drafting Masterclass",
    date: "March 30, 2024",
    time: "5:30 PM IST",
    duration: "2.5 hours",
    attendees: "100+",
    description: "Advanced techniques in legal document drafting with practical examples and templates.",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Constitutional Law Updates",
    date: "April 5, 2024",
    time: "6:30 PM IST",
    duration: "2 hours",
    attendees: "180+",
    description: "Recent developments in constitutional law and landmark judgments analysis.",
    status: "upcoming"
  }
];

const Webinars = () => {
  return (
    <section id="webinars" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Live <span className="gradient-gold bg-clip-text text-transparent">Webinars</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our expert-led webinars covering the latest developments in legal education and practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {webinars.map((webinar) => (
            <Card key={webinar.id} className="shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    webinar.status === 'upcoming' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {webinar.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    {webinar.attendees}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {webinar.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {webinar.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {webinar.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    {webinar.time} • {webinar.duration}
                  </div>
                </div>

                <Button 
                  className={`w-full ${
                    webinar.status === 'upcoming'
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                  }`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {webinar.status === 'upcoming' ? 'Register Now' : 'Watch Recording'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            View All Webinars
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Webinars;