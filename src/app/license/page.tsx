import Link from 'next/link';
import { ArrowLeft, Mail, ExternalLink } from 'lucide-react';

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Icons
          </Link>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Icon Usage & Licensing
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Free Personal Use */}
          <section className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Free Personal Use
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              You&apos;re welcome to use these city icons for personal projects, presentations, and non-commercial purposes with attribution.
            </p>
            
            <div className="bg-background border rounded-lg p-4">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Required Attribution:
              </h3>
              <p className="text-muted-foreground">
                &quot;City icons by Studio Partdirector&quot; (
                <a 
                  href="https://cities.partdirector.ch" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  cities.partdirector.ch
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                )
              </p>
            </div>
          </section>

          {/* Commercial Use */}
          <section className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Commercial Use
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Planning to use these icons in a commercial project, client work, or product? We&apos;d love to hear about it! Commercial licensing ensures you get:
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-muted-foreground">Full usage rights without attribution requirements</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-muted-foreground">Priority support for custom requests</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-muted-foreground">Peace of mind for your business</span>
              </li>
            </ul>

            <div className="bg-background border rounded-lg p-4">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Contact for Commercial Licensing:
              </h3>
              <a 
                href="mailto:cities@partdirector.ch"
                className="inline-flex items-center text-primary hover:underline"
              >
                <Mail className="w-4 h-4 mr-2" />
                cities@partdirector.ch
              </a>
            </div>
          </section>

          {/* What We Consider Commercial */}
          <section className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What We Consider Commercial:
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-muted-foreground">Client projects and freelance work</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-muted-foreground">Products or services you sell</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-muted-foreground">Marketing materials for businesses</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-muted-foreground">Applications or websites that generate revenue</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-muted-foreground">Resale or redistribution of icons</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © Studio Partdirector, 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 