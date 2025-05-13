
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flag, Info, Shield, Globe, Megaphone, AlertTriangle } from "lucide-react";

// Import components
import { Separator } from "@/components/ui/separator";

const FlagAgent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center">
          <Flag size={28} className="text-primary mr-3" />
          <h1 className="text-3xl font-bold">Flag Agent - Multilingual AI Translator</h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          No barriers. No limits. Just speak. Talk. Connect. Be. Heard.
        </p>
        
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary">AIO-2030</Badge>
          <Badge variant="secondary">Translator</Badge>
          <Badge variant="secondary">Multilingual</Badge>
          <Badge variant="secondary">AI-Powered</Badge>
          <Badge variant="outline" className="bg-primary/10">New</Badge>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-black to-gray-900 mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        <img 
          src="/lovable-uploads/997ae79b-9c1a-4a50-8af3-1bb87610b488.png"
          alt="Flag Agent AI Translator Device" 
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Multilingual Multi-Scenario <span className="text-primary">AI Translator</span>
          </h2>
          <p className="text-white/80 mb-4 max-w-2xl">
            Breaking language barriers in real-time with advanced voice recognition and translation technology.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Pre-order Now
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">High Performance & Reliability</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>40+ Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Support for over 40 languages including all major global languages and many regional dialects.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Real-time Translation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Near-instantaneous translation with minimal latency, powered by our proprietary neural network.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Offline Capability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Works without internet for core languages, ensuring reliability in any situation.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Megaphone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Voice Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced algorithms can distinguish speakers even in noisy environments with 98% accuracy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Context Awareness</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Understands context and nuance to provide culturally appropriate translations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Flag className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Continuous Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                AI model improves with use, adapting to your speaking patterns and vocabulary.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Product Image Gallery</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-lg overflow-hidden h-48 md:h-64">
            <img src="/lovable-uploads/997ae79b-9c1a-4a50-8af3-1bb87610b488.png" alt="Flag Agent" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="font-medium text-white mb-2">Compact Design</h3>
              <p className="text-white/70 text-sm">Fits easily in your pocket or bag</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="font-medium mb-2">Long Battery Life</h3>
              <p className="text-muted-foreground text-sm">Up to 48 hours of standby time</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-br from-blue-900/30 to-blue-800/10 flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="font-medium mb-2">Smart Connectivity</h3>
              <p className="text-muted-foreground text-sm">Bluetooth 5.2 & WiFi 6 Support</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="font-medium text-white mb-2">Durable Build</h3>
              <p className="text-white/70 text-sm">Military-grade drop protection</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden h-48 md:h-64">
            <img src="/lovable-uploads/997ae79b-9c1a-4a50-8af3-1bb87610b488.png" alt="Flag Agent Side View" className="w-full h-full object-cover object-bottom" />
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="mb-16">
        <div className="bg-primary/5 rounded-xl p-8 border border-primary/20">
          <h2 className="text-2xl font-bold mb-6 text-center">Designed for Every Scenario</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Flag size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">International Business</h3>
                  <p className="text-muted-foreground text-sm">
                    Close deals and build relationships across language barriers with accurate business translation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Globe size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">World Travel</h3>
                  <p className="text-muted-foreground text-sm">
                    Navigate foreign countries with ease, from ordering food to asking for directions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Megaphone size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Educational Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Help students learn languages with pronunciation guidance and instant feedback.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Shield size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Emergency Services</h3>
                  <p className="text-muted-foreground text-sm">
                    Critical communication support for first responders and medical personnel.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Info size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Conferences & Events</h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time translation for international events without the need for human translators.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <AlertTriangle size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cultural Exchange</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with people from different cultures and backgrounds with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Technical Specs */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
        
        <Tabs defaultValue="hardware" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="ai">AI Capabilities</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hardware" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Device Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span className="font-medium">65mm x 65mm x 18mm</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="font-medium">75g</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Battery</span>
                    <span className="font-medium">1500mAh Li-Po</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processor</span>
                    <span className="font-medium">Custom Neural Processing Unit</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Memory</span>
                    <span className="font-medium">16GB Storage, 4GB RAM</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connectivity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bluetooth</span>
                    <span className="font-medium">5.2 with LE Audio</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WiFi</span>
                    <span className="font-medium">802.11ax (WiFi 6)</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audio</span>
                    <span className="font-medium">4 Far-field Microphones</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Speaker</span>
                    <span className="font-medium">360° Omnidirectional</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Charging</span>
                    <span className="font-medium">USB-C, Wireless Qi</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Language Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Languages</span>
                    <span className="font-medium">40+</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Offline Languages</span>
                    <span className="font-medium">12</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dialect Support</span>
                    <span className="font-medium">25+ regional variations</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Translation Speed</span>
                    <span className="font-medium">&lt;0.5 seconds</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model Size</span>
                    <span className="font-medium">5.8B parameters</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contextual Understanding</span>
                    <span className="font-medium">Advanced</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Noise Cancellation</span>
                    <span className="font-medium">Adaptive multi-level</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Learning Capability</span>
                    <span className="font-medium">On-device adaptation</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Privacy</span>
                    <span className="font-medium">Local processing, optional cloud</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="compatibility" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Device Compatibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mobile OS</span>
                    <span className="font-medium">iOS 15+, Android 10+</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desktop OS</span>
                    <span className="font-medium">Windows 10+, macOS 11+, Linux</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Companion App</span>
                    <span className="font-medium">Available on all platforms</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ecosystem Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Smart Home</span>
                    <span className="font-medium">Works with major platforms</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Video Conferencing</span>
                    <span className="font-medium">Zoom, Teams, Google Meet</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API Access</span>
                    <span className="font-medium">Developer SDK available</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pre-order Flag Agent Today</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers breaking language barriers. Limited early-bird pricing available now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Pre-order Now
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Expected shipping date: Q3 2025. Limited quantities available.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What languages does Flag Agent support?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Flag Agent supports over 40 languages including English, Spanish, Mandarin, Japanese, French, German, Russian, Arabic, Hindi, Portuguese, and many more. We're constantly adding new languages through software updates.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How accurate are the translations?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Flag Agent achieves 95%+ accuracy for common phrases and conversations. Our contextual understanding helps capture nuance and meaning beyond literal translations, making communication feel natural.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Does it work without internet?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! Flag Agent can operate completely offline for 12 core languages. Additional languages require internet connectivity for translation processing.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's the battery life like?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Flag Agent provides 8 hours of active translation use, or up to 48 hours in standby mode. It charges fully in under 90 minutes via USB-C or wireless charging.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How is my data handled?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Privacy is core to our design. All offline translations happen on-device. For online translations, data is processed securely and not stored beyond the translation session unless you explicitly opt in to help improve the service.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's in the box?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Each Flag Agent comes with the device itself, a premium protective case, USB-C charging cable, quick start guide, and a 1-year warranty card. Premium packages also include a wireless charging pad.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <footer className="border-t pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Flag size={24} className="text-primary mr-2" />
              <h3 className="font-bold text-xl">Flag Agent</h3>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Speak. Connect. Understand.</p>
          </div>
          
          <div className="flex gap-6">
            <Button variant="ghost" size="sm">Privacy Policy</Button>
            <Button variant="ghost" size="sm">Terms of Service</Button>
            <Button variant="ghost" size="sm">Contact Us</Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-8 pb-8">
          &copy; 2025 AIO-2030 Protocol Foundation. All rights reserved. Flag Agent is a trademark of AIO-2030.
        </div>
      </footer>
    </div>
  );
};

export default FlagAgent;
