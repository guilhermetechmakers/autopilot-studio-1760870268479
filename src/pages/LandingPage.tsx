import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  FileText, 
  Rocket, 
  Bot, 
  CheckCircle, 
  DollarSign,
  ArrowRight,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent-green" />
            <span className="text-xl font-bold">Autopilot Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-accent-green text-background hover:bg-accent-green/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Complete Business OS for
            <span className="text-accent-green"> AI Development Teams</span>
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Automate your entire service pipeline from lead intake through handover. 
            Built for agencies and development teams who want to focus on building, not admin.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/intake">
              <Button size="lg" className="bg-accent-green text-background hover:bg-accent-green/90">
                Book Intake <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need, Automated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardHeader>
              <div className="rounded-lg bg-accent-green/10 p-3 w-fit mb-2">
                <Sparkles className="h-6 w-6 text-accent-green" />
              </div>
              <CardTitle>AI-Assisted Intake</CardTitle>
              <CardDescription>
                Smart qualification and automated proposal generation from lead conversations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="rounded-lg bg-accent-blue/10 p-3 w-fit mb-2">
                <FileText className="h-6 w-6 text-accent-blue" />
              </div>
              <CardTitle>Proposals & E-Contracts</CardTitle>
              <CardDescription>
                Generate, customize, and e-sign contracts in minutes with full audit trails
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="rounded-lg bg-accent-purple/10 p-3 w-fit mb-2">
                <Rocket className="h-6 w-6 text-accent-purple" />
              </div>
              <CardTitle>One-Click Spin-up</CardTitle>
              <CardDescription>
                Instantly create project spaces with repos, milestones, and client portals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <div className="rounded-lg bg-accent-yellow/10 p-3 w-fit mb-2">
                <Bot className="h-6 w-6 text-accent-yellow" />
              </div>
              <CardTitle>AI Copilot</CardTitle>
              <CardDescription>
                Context-aware assistant for specs, tickets, and meeting summaries
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <div className="rounded-lg bg-accent-green/10 p-3 w-fit mb-2">
                <CheckCircle className="h-6 w-6 text-accent-green" />
              </div>
              <CardTitle>Launch Automation</CardTitle>
              <CardDescription>
                QA checklists, security gates, and one-click deployments to Vercel/Cloudflare
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <div className="rounded-lg bg-accent-blue/10 p-3 w-fit mb-2">
                <DollarSign className="h-6 w-6 text-accent-blue" />
              </div>
              <CardTitle>Billing & QuickBooks</CardTitle>
              <CardDescription>
                Automated invoicing, payment processing, and accounting sync
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Workflow Illustration */}
      <section className="container mx-auto px-4 py-20 bg-card/30">
        <h2 className="text-3xl font-bold text-center mb-12">
          Your Pipeline, Fully Automated
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in-up">
              <div className="rounded-full bg-accent-green/10 p-6 w-fit mx-auto mb-4">
                <span className="text-3xl font-bold text-accent-green">1</span>
              </div>
              <h3 className="font-semibold mb-2">Intake</h3>
              <p className="text-sm text-muted">AI-assisted qualification and proposal generation</p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="rounded-full bg-accent-blue/10 p-6 w-fit mx-auto mb-4">
                <span className="text-3xl font-bold text-accent-blue">2</span>
              </div>
              <h3 className="font-semibold mb-2">Contract</h3>
              <p className="text-sm text-muted">E-sign and automated project setup</p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="rounded-full bg-accent-purple/10 p-6 w-fit mx-auto mb-4">
                <span className="text-3xl font-bold text-accent-purple">3</span>
              </div>
              <h3 className="font-semibold mb-2">Deliver</h3>
              <p className="text-sm text-muted">AI copilot, time tracking, and client portal</p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="rounded-full bg-accent-yellow/10 p-6 w-fit mx-auto mb-4">
                <span className="text-3xl font-bold text-accent-yellow">4</span>
              </div>
              <h3 className="font-semibold mb-2">Handover</h3>
              <p className="text-sm text-muted">Launch automation and SLA bot support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>For small teams getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">Up to 5 projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">AI-assisted intake</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">Basic integrations</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-accent-green border-2">
            <CardHeader>
              <div className="text-xs font-semibold text-accent-green mb-2">MOST POPULAR</div>
              <CardTitle>Professional</CardTitle>
              <CardDescription>For growing agencies</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$149</span>
                <span className="text-muted">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">Unlimited projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">Full AI copilot</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">All integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <Button className="w-full mt-6 bg-accent-green text-background hover:bg-accent-green/90">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large organizations</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-sm">SLA guarantees</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-card p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Automate Your Agency?
          </h2>
          <p className="text-secondary mb-8">
            Join hundreds of development teams who've automated their entire service pipeline
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/intake">
              <Button size="lg" className="bg-accent-green text-background hover:bg-accent-green/90">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-accent-green" />
                <span className="font-bold">Autopilot Studio</span>
              </div>
              <p className="text-sm text-muted">
                The complete Business OS for AI development teams
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/integrations">Integrations</Link></li>
                <li><Link to="/docs">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/security">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted">
              © 2025 Autopilot Studio. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
