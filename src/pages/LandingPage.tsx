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
  Twitter,
  Play,
  Star,
  Quote
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent-green" />
            <span className="text-xl font-bold">Autopilot Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hover:bg-card">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-accent-green text-background hover:bg-accent-green/90 transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-accent-green/10 rounded-full text-accent-green text-sm font-medium animate-bounce-in">
            ✨ The Complete Business OS for AI Teams
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Complete Business OS for
            <span className="text-accent-green"> AI Development Teams</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Automate your entire service pipeline from lead intake through handover. 
            Built for agencies and development teams who want to focus on building, not admin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/intake">
              <Button 
                size="lg" 
                className="bg-accent-green text-background hover:bg-accent-green/90 transition-all duration-200 hover:scale-105 hover:shadow-lg text-base px-8"
              >
                Book Intake <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-card transition-all duration-200 hover:scale-105 text-base px-8"
              >
                Request Demo
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted mb-4">TRUSTED BY LEADING DEVELOPMENT TEAMS</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="text-xl font-bold">TechCorp</div>
              <div className="text-xl font-bold">DevStudio</div>
              <div className="text-xl font-bold">CodeLabs</div>
              <div className="text-xl font-bold">BuildFast</div>
              <div className="text-xl font-bold">AgencyPro</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tour Video */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="aspect-video bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center relative group cursor-pointer">
              <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-300" />
              <div className="relative z-10 text-center">
                <div className="rounded-full bg-accent-green/20 p-6 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-12 w-12 text-accent-green fill-accent-green" />
                </div>
                <p className="text-lg font-semibold">Watch Product Tour</p>
                <p className="text-sm text-muted mt-2">See how Autopilot Studio transforms your workflow</p>
              </div>
              {/* Placeholder for Loom embed - replace with actual embed code */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
                {/* <iframe src="https://www.loom.com/embed/YOUR_VIDEO_ID" /> */}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Overview */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need, Automated
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            From first contact to final handover, every step of your service pipeline runs on autopilot
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-card hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up border-border">
            <CardHeader className="pb-4">
              <div className="rounded-lg bg-accent-green/10 p-3 w-fit mb-3">
                <Sparkles className="h-6 w-6 text-accent-green" />
              </div>
              <CardTitle className="text-xl">AI-Assisted Intake</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Smart qualification and automated proposal generation from lead conversations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up border-border" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-4">
              <div className="rounded-lg bg-accent-blue/10 p-3 w-fit mb-3">
                <FileText className="h-6 w-6 text-accent-blue" />
              </div>
              <CardTitle className="text-xl">Auto-Proposals</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Generate, customize, and e-sign contracts in minutes with full audit trails
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up border-border" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-4">
              <div className="rounded-lg bg-accent-purple/10 p-3 w-fit mb-3">
                <Rocket className="h-6 w-6 text-accent-purple" />
              </div>
              <CardTitle className="text-xl">Project Spin-up</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Instantly create project spaces with repos, milestones, and client portals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up border-border" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-4">
              <div className="rounded-lg bg-accent-yellow/10 p-3 w-fit mb-3">
                <Bot className="h-6 w-6 text-accent-yellow" />
              </div>
              <CardTitle className="text-xl">AI Copilot</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Context-aware assistant for specs, tickets, and meeting summaries
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up border-border" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-4">
              <div className="rounded-lg bg-accent-green/10 p-3 w-fit mb-3">
                <CheckCircle className="h-6 w-6 text-accent-green" />
              </div>
              <CardTitle className="text-xl">Launch Automation</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                QA checklists, security gates, and one-click deployments to Vercel/Cloudflare
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up border-border" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="pb-4">
              <div className="rounded-lg bg-accent-blue/10 p-3 w-fit mb-3">
                <DollarSign className="h-6 w-6 text-accent-blue" />
              </div>
              <CardTitle className="text-xl">Billing & QuickBooks</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Automated invoicing, payment processing, and accounting sync
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works - 4-Step Workflow */}
      <section className="container mx-auto px-4 py-20 bg-card/30 rounded-3xl my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Pipeline, Fully Automated
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Four simple steps from lead to launch, all running on autopilot
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in-up group">
              <div className="rounded-full bg-accent-green/10 p-8 w-fit mx-auto mb-4 group-hover:bg-accent-green/20 transition-all duration-300 group-hover:scale-110">
                <span className="text-4xl font-bold text-accent-green">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Intake</h3>
              <p className="text-sm text-muted leading-relaxed">
                AI-assisted qualification and proposal generation
              </p>
            </div>
            
            <div className="text-center animate-fade-in-up group" style={{ animationDelay: '0.1s' }}>
              <div className="rounded-full bg-accent-blue/10 p-8 w-fit mx-auto mb-4 group-hover:bg-accent-blue/20 transition-all duration-300 group-hover:scale-110">
                <span className="text-4xl font-bold text-accent-blue">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Contract</h3>
              <p className="text-sm text-muted leading-relaxed">
                E-sign and automated project setup
              </p>
            </div>
            
            <div className="text-center animate-fade-in-up group" style={{ animationDelay: '0.2s' }}>
              <div className="rounded-full bg-accent-purple/10 p-8 w-fit mx-auto mb-4 group-hover:bg-accent-purple/20 transition-all duration-300 group-hover:scale-110">
                <span className="text-4xl font-bold text-accent-purple">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Deliver</h3>
              <p className="text-sm text-muted leading-relaxed">
                AI copilot, time tracking, and client portal
              </p>
            </div>
            
            <div className="text-center animate-fade-in-up group" style={{ animationDelay: '0.3s' }}>
              <div className="rounded-full bg-accent-yellow/10 p-8 w-fit mx-auto mb-4 group-hover:bg-accent-yellow/20 transition-all duration-300 group-hover:scale-110">
                <span className="text-4xl font-bold text-accent-yellow">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Handover</h3>
              <p className="text-sm text-muted leading-relaxed">
                Launch automation and SLA bot support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Development Teams
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            See what agencies and dev teams are saying about Autopilot Studio
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent-yellow fill-accent-yellow" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-accent-green/30 mb-2" />
              <CardDescription className="text-base leading-relaxed">
                "Autopilot Studio cut our project setup time from 2 days to 15 minutes. 
                The AI copilot alone has saved us countless hours on documentation."
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-accent-green/20 h-10 w-10 flex items-center justify-center font-bold text-accent-green">
                  SM
                </div>
                <div>
                  <p className="font-semibold text-sm">Sarah Mitchell</p>
                  <p className="text-xs text-muted">CTO, TechCorp</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent-yellow fill-accent-yellow" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-accent-blue/30 mb-2" />
              <CardDescription className="text-base leading-relaxed">
                "The automated proposals and e-contracts have transformed our sales process. 
                We're closing deals 3x faster than before."
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-accent-blue/20 h-10 w-10 flex items-center justify-center font-bold text-accent-blue">
                  JC
                </div>
                <div>
                  <p className="font-semibold text-sm">James Chen</p>
                  <p className="text-xs text-muted">Founder, DevStudio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent-yellow fill-accent-yellow" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-accent-purple/30 mb-2" />
              <CardDescription className="text-base leading-relaxed">
                "Finally, a tool that understands agency workflows. The client portal and handover 
                automation have made our clients incredibly happy."
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-accent-purple/20 h-10 w-10 flex items-center justify-center font-bold text-accent-purple">
                  ER
                </div>
                <div>
                  <p className="font-semibold text-sm">Emily Rodriguez</p>
                  <p className="text-xs text-muted">Director, AgencyPro</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Choose the plan that fits your team. All plans include core automation features.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Starter</CardTitle>
              <CardDescription>For small teams getting started</CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold">$49</span>
                <span className="text-muted text-lg">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Up to 5 projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">AI-assisted intake</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Basic integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full hover:scale-105 transition-transform" variant="outline">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-accent-green border-2 hover:shadow-2xl transition-all duration-300 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-accent-green text-background px-4 py-1 rounded-full text-xs font-semibold">
                MOST POPULAR
              </div>
            </div>
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-2xl">Professional</CardTitle>
              <CardDescription>For growing agencies</CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold">$149</span>
                <span className="text-muted text-lg">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Unlimited projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Full AI copilot</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">All integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Custom branding</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-accent-green text-background hover:bg-accent-green/90 hover:scale-105 transition-all">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For large organizations</CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">SLA guarantees</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <span className="text-sm">On-premise option</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full hover:scale-105 transition-transform" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-card to-card/50 p-12 md:p-16 rounded-3xl border border-border hover:shadow-2xl transition-all duration-300">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Automate Your Agency?
          </h2>
          <p className="text-lg text-secondary mb-8 leading-relaxed">
            Join hundreds of development teams who've automated their entire service pipeline 
            and are shipping faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/intake">
              <Button 
                size="lg" 
                className="bg-accent-green text-background hover:bg-accent-green/90 transition-all duration-200 hover:scale-105 hover:shadow-lg text-base px-8"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/signup">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-card transition-all duration-200 hover:scale-105 text-base px-8"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-sidebar/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-accent-green" />
                <span className="font-bold text-lg">Autopilot Studio</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                The complete Business OS for AI development teams. Automate your pipeline from lead to launch.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted">
              © 2025 Autopilot Studio. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
