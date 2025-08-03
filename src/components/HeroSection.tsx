import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlayCircle, 
  ArrowRight, 
  Shield,
  Zap,
  BarChart3,
  MapPin
} from "lucide-react";
import heroImage from "@/assets/hero-asphalt.jpg";

const HeroSection = () => {
  const features = [
    { icon: Shield, title: "Advanced AI Analytics", description: "Predictive insights for pavement lifecycle" },
    { icon: Zap, title: "Real-time Operations", description: "Live monitoring and instant notifications" },
    { icon: BarChart3, title: "Performance Analytics", description: "Comprehensive reporting and KPI tracking" },
    { icon: MapPin, title: "Geospatial Mapping", description: "Interactive project location management" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-industrial-dark/90 via-industrial-dark/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-industrial-dark/80 via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-industrial-orange/20 text-industrial-orange px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                Next-Generation Pavement Management
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Asphalt Pavement
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Operations System
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                A full-featured, production-ready pavement performance suite integrating advanced AI, 
                analytics, project management, and real-time operations for maximum efficiency across 
                the pavement lifecycle.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-industrial-dark font-semibold"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Launch Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                View Documentation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">94%</div>
                <div className="text-sm text-gray-400">Efficiency Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Monitoring</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Core Capabilities</h3>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-primary rounded-lg">
                          <feature.icon className="h-4 w-4 text-industrial-dark" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm">{feature.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="bg-industrial-orange/20 border border-industrial-orange/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-industrial-orange rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">System Status: Operational</p>
                  <p className="text-xs text-gray-400">All systems running optimally</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;