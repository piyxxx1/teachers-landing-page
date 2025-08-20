import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="bg-card p-8 rounded-lg shadow-card">
            <h2 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h2>
            
            <div className="space-y-6 text-muted-foreground">
              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">1. Information We Collect</h3>
                <p>
                  We collect information you provide directly to us, such as when you register for courses, contact us, or subscribe to our newsletter. This may include:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Educational background and preferences</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Provide and improve our educational services</li>
                  <li>Process course registrations and payments</li>
                  <li>Send you important updates about courses and webinars</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">3. Information Sharing</h3>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>With service providers who assist us in operating our website and services</li>
                  <li>To comply with legal requirements or protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">4. Data Security</h3>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">5. Cookies and Tracking</h3>
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">6. Third-Party Links</h3>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">7. Your Rights</h3>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request information about how we process your data</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">8. Data Retention</h3>
                <p>
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">9. Children's Privacy</h3>
                <p>
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">10. Changes to This Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">11. Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-2">
                  <p>Email: contact@jltacademy.com</p>
                  <p>Phone: +91 7248926070</p>
                  <p>Address: Behind Jagtap Patil Petrol Pump, Opposite Military Ground, Pune 411061</p>
                </div>
              </section>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
