import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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
            <h1 className="text-2xl font-bold">Terms and Conditions</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="bg-card p-8 rounded-lg shadow-card">
            <h2 className="text-3xl font-bold mb-8 text-center">Terms and Conditions</h2>
            
            <div className="space-y-6 text-muted-foreground">
              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using JLT Academy's website and services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">2. Use License</h3>
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on JLT Academy's website for personal, non-commercial transitory viewing only.
                </p>
                <p className="mt-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">3. Course Registration and Payment</h3>
                <p>
                  Registration for courses and webinars is subject to availability and payment of applicable fees. All fees are non-refundable unless otherwise specified.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">4. Intellectual Property</h3>
                <p>
                  All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of JLT Academy and is protected by copyright laws.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">5. Disclaimer</h3>
                <p>
                  The materials on JLT Academy's website are provided on an 'as is' basis. JLT Academy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">6. Limitations</h3>
                <p>
                  In no event shall JLT Academy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on JLT Academy's website.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">7. Revisions and Errata</h3>
                <p>
                  The materials appearing on JLT Academy's website could include technical, typographical, or photographic errors. JLT Academy does not warrant that any of the materials on its website are accurate, complete or current.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">8. Links</h3>
                <p>
                  JLT Academy has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by JLT Academy of the site.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">9. Modifications</h3>
                <p>
                  JLT Academy may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 text-foreground">10. Contact Information</h3>
                <p>
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="mt-2">
                  <p>Email: contact@jltacademy.com</p>
                  <p>Phone: +91 7248926070</p>
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

export default Terms;
