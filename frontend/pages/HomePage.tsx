import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Palette, 
  Type, 
  Square, 
  Image, 
  MousePointer, 
  Download,
  Layers,
  Settings,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const features = [
    {
      icon: Palette,
      title: "Visual Design Tools",
      description: "Create stunning designs with our intuitive visual editor featuring shapes, text, and images."
    },
    {
      icon: Layers,
      title: "Layer Management",
      description: "Organize your design elements with advanced layer controls including reordering and visibility."
    },
    {
      icon: Type,
      title: "Rich Text Editing",
      description: "Add and customize text with multiple fonts, sizes, colors, and alignment options."
    },
    {
      icon: Square,
      title: "Shape Library",
      description: "Insert rectangles, circles, and lines with customizable fills, strokes, and dimensions."
    },
    {
      icon: Image,
      title: "Image Upload",
      description: "Upload and integrate your own images seamlessly into your design projects."
    },
    {
      icon: Settings,
      title: "Precise Controls",
      description: "Fine-tune every aspect of your design with detailed property panels and controls."
    },
    {
      icon: MousePointer,
      title: "Interactive Canvas",
      description: "Drag, drop, resize, and rotate elements with smooth real-time interactions."
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Export your finished designs in PNG or JPG formats for any use case."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-2xl mr-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Visual Design Studio
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A modern, web-based design application built with cutting-edge technology. 
            Create beautiful graphics, layouts, and visual content with our intuitive 
            drag-and-drop interface and powerful editing tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 text-lg"
            >
              View Examples
            </Button>
          </div>

          {/* Tech Stack Badge */}
          <div className="bg-muted/50 rounded-lg p-4 inline-block">
            <p className="text-sm text-muted-foreground mb-2">Built with modern technology</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-medium">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">React</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">TypeScript</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Encore.ts</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Tailwind CSS</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Vite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional designs, from simple graphics to complex layouts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border/50 hover:border-border transition-colors">
              <CardHeader className="pb-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 pb-16">
        <div className="bg-primary/5 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Ready to Start Designing?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Visual Design Studio to bring their ideas to life. 
            No downloads required - start creating in your browser today.
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium"
          >
            Launch Design Studio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold">Visual Design Studio</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A modern design application built with React, TypeScript, and Encore.ts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
