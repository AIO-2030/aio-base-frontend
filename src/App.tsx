
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// Components
import Toolbar from "./components/Toolbar";
import MainMenu from "./components/MainMenu";
import MainContent from "./components/MainContent";
import ChatContainer from "./components/chat/ChatContainer";

// Routes
import Home from "./routes/Home";
import AIProjects from "./routes/AIProjects";
import OpenSource from "./routes/OpenSource";
import BestPractices from "./routes/BestPractices";
import AgentStore from "./routes/AgentStore";
import AddAgent from "./routes/AddAgent";
import MCPStore from "./routes/MCPStore";
import AddMCPServer from "./routes/AddMCPServer";
import UserDashboard from "./routes/UserDashboard";
import WalletSettings from "./routes/WalletSettings";
import MainDashboard from "./routes/MainDashboard";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AgentImplementation from "./routes/AgentImplementation";
import MCPImplementation from "./routes/MCPImplementation";
import AgentDetails from "./routes/AgentDetails";
import MCPServerDetails from "./routes/MCPServerDetails";
import FlagAgent from "./routes/FlagAgent";

// Context
import { ChatProvider } from "./contexts/ChatContext";

const queryClient = new QueryClient();

function App() {
  const [showChat, setShowChat] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Add initialization effect to ensure app is ready to render
  useEffect(() => {
    // Small delay to ensure all dependencies are loaded
    const timer = setTimeout(() => {
      setAppReady(true);
      console.log("App initialized and ready to render");
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading application...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing Page Route */}
              <Route path="/" element={<Index />} />
              
              {/* App Routes with Toolbar and Layout */}
              <Route path="/*" element={
                <div className="h-screen flex flex-col">
                  <Toolbar />
                  
                  <div className="flex flex-1 overflow-hidden">
                    {/* Left: Main Menu */}
                    <div className="w-64 flex-shrink-0 hidden md:block">
                      <MainMenu />
                    </div>
                    
                    {/* Center: Main Content */}
                    <div className="flex-1 flex overflow-hidden">
                      <Routes>
                        <Route path="home/*" element={
                          showChat ? (
                            <ResizablePanelGroup 
                              direction="horizontal" 
                              className="w-full"
                            >
                              <ResizablePanel defaultSize={75} minSize={30} maxSize={90}>
                                <MainContent showChat={showChat} />
                              </ResizablePanel>
                              <ResizableHandle withHandle />
                              <ResizablePanel defaultSize={25} minSize={10} maxSize={70}>
                                <div className="h-full overflow-hidden">
                                  <ChatContainer />
                                </div>
                              </ResizablePanel>
                            </ResizablePanelGroup>
                          ) : (
                            <MainContent showChat={showChat} />
                          )
                        }>
                          <Route index element={<Home />} />
                          <Route path="dashboard" element={<MainDashboard />} />
                          <Route path="ai-projects" element={<AIProjects />} />
                          <Route path="open-source" element={<OpenSource />} />
                          <Route path="best-practices" element={<BestPractices />} />
                          <Route path="agent-store" element={<AgentStore />} />
                          <Route path="add-agent" element={<AddAgent />} />
                          <Route path="agent-implementation" element={<AgentImplementation />} />
                          <Route path="agent/:id" element={<AgentDetails />} />
                          <Route path="mcp-store" element={<MCPStore />} />
                          <Route path="add-mcp-server" element={<AddMCPServer />} />
                          <Route path="mcp-implementation" element={<MCPImplementation />} />
                          <Route path="mcp-server/:id" element={<MCPServerDetails />} />
                          <Route path="frameworks" element={<MCPStore />} /> {/* Redirect old path */}
                          <Route path="flag-agent" element={<FlagAgent />} />
                          <Route path="*" element={<NotFound />} />
                        </Route>
                        <Route path="user-dashboard" element={<MainContent showChat={false} />}>
                          <Route index element={<UserDashboard />} />
                          <Route path="wallet-settings" element={<WalletSettings />} />
                        </Route>
                      </Routes>
                    </div>
                  </div>
                  
                  {/* Mobile Chat Toggle (only visible on small screens) */}
                  <div className="lg:hidden fixed bottom-5 right-5 z-50">
                    {!showChat && (
                      <button 
                        onClick={() => setShowChat(true)}
                        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                      >
                        Chat
                      </button>
                    )}
                  </div>
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
