import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
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
          <p className="text-lg text-muted-foreground">
            Clear guidelines for using our city icons in your projects
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Free Personal Use */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Free Personal Use
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              You&apos;re welcome to use these city icons for personal projects, presentations, and non-commercial purposes with attribution.
            </p>
            
            <div className="mb-6">
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
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Commercial Use
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Planning to use these icons in a commercial project, client work, or product? We&apos;d love to hear about it! Commercial licensing ensures you get:
            </p>
            
            <ul className="space-y-3 mb-8">
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

            <div className="mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Contact for Commercial Licensing:
              </h3>
              <a 
                href="mailto:cities@partdirector.ch"
                className="text-primary hover:underline"
              >
                cities@partdirector.ch
              </a>
            </div>
          </section>

          {/* What We Consider Commercial */}
          <section>
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
        <footer className="py-6 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-foreground">
              © Studio Partdirector, 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 