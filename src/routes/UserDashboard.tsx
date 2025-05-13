
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Server, Code, PhoneCall, Wallet, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMetaMaskConnect, shortenAddress } from "@/lib/Metamask-wallet";

// Mock user data - In a real app, you would fetch this from your backend
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "",
  aiAgents: [
    { id: "1", name: "Research Assistant", type: "agent", usage: 145 },
    { id: "2", name: "Data Analyzer", type: "agent", usage: 89 },
  ],
  mcpServers: [
    { id: "1", name: "Knowledge Graph Memory", type: "server", usage: 210 },
    { id: "2", name: "MySQL Database", type: "server", usage: 78 },
  ],
  openSourceAssets: [
    { id: "1", name: "AI Prompt Collection", downloads: 1245, stars: 87 },
    { id: "2", name: "MCP Protocol Extensions", downloads: 765, stars: 42 },
  ],
  callLogs: [
    { id: "1", assetName: "Research Assistant", date: "2023-10-15", duration: "5m 12s", tokens: 450 },
    { id: "2", assetName: "Knowledge Graph Memory", date: "2023-10-14", duration: "3m 45s", tokens: 320 },
    { id: "3", assetName: "Data Analyzer", date: "2023-10-12", duration: "8m 33s", tokens: 780 },
  ],
  pendingTokens: 2450,
  tokenHistory: [
    { date: "2023-10", earned: 1200, claimed: 1000 },
    { date: "2023-09", earned: 950, claimed: 950 },
    { date: "2023-08", earned: 1100, claimed: 800 },
  ]
};

const UserDashboard = () => {
  const { toast } = useToast();
  const { account, handleConnectWallet, isConnecting } = useMetaMaskConnect();
  const [claimInProgress, setClaimInProgress] = useState(false);
  
  const handleClaimTokens = async () => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first to claim tokens.",
        variant: "destructive",
      });
      return;
    }
    
    setClaimInProgress(true);
    
    // Simulate API call to claim tokens
    setTimeout(() => {
      toast({
        title: "Tokens claimed!",
        description: `${userData.pendingTokens} tokens have been transferred to your wallet.`,
      });
      setClaimInProgress(false);
    }, 2000);
  };

  return (
    <div className="pt-6 pb-12">
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
        {/* User Profile Card - Fixed Text Overflow */}
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0"> {/* Added min-width to enable text truncation */}
                <CardTitle className="truncate">{userData.name}</CardTitle>
                <CardDescription className="truncate">{userData.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Wallet</span>
                <div className="flex-shrink-0">
                  {account ? (
                    <span className="text-sm font-medium">{shortenAddress(account)}</span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleConnectWallet} disabled={isConnecting}>
                      <Wallet className="mr-2 h-4 w-4" />
                      {isConnecting ? "Connecting..." : "Connect"}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Tokens</span>
                <span className="font-medium">{userData.pendingTokens.toLocaleString()}</span>
              </div>
              
              <Button 
                onClick={handleClaimTokens} 
                disabled={claimInProgress || !account || userData.pendingTokens === 0}
              >
                {claimInProgress ? "Processing..." : "Claim Tokens"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Token Overview Card */}
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Token Incentives
            </CardTitle>
            <CardDescription>Overview of your token earnings and claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Token metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{userData.pendingTokens.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Available to Claim</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {userData.tokenHistory.reduce((sum, item) => sum + item.earned, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Earned</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {userData.tokenHistory.reduce((sum, item) => sum + item.claimed, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Claimed</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Token history */}
              <div>
                <h4 className="text-sm font-medium mb-3">Recent History</h4>
                <div className="space-y-2">
                  {userData.tokenHistory.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-md bg-secondary/30">
                      <span>{item.date}</span>
                      <div className="flex gap-4">
                        <span className="text-sm">
                          <span className="text-muted-foreground">Earned:</span> {item.earned}
                        </span>
                        <span className="text-sm">
                          <span className="text-muted-foreground">Claimed:</span> {item.claimed}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Assets Tabs */}
      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Agents & Servers</span>
            <span className="sm:hidden">Assets</span>
          </TabsTrigger>
          <TabsTrigger value="opensource" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Open Source</span>
            <span className="sm:hidden">OS</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span className="hidden sm:inline">Call Logs</span>
            <span className="sm:hidden">Calls</span>
          </TabsTrigger>
          <TabsTrigger value="tokens" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Token Details</span>
            <span className="sm:hidden">Tokens</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Agents & MCP Servers Tab */}
        <TabsContent value="agents" className="space-y-4 mt-6">
          <h3 className="text-xl font-semibold mb-4">Your AI Agents & MCP Servers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.aiAgents.map(agent => (
              <Card key={agent.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <CardDescription>AI Agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage</span>
                    <span>{agent.usage} calls</span>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {userData.mcpServers.map(server => (
              <Card key={server.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{server.name}</CardTitle>
                  <CardDescription>MCP Server</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage</span>
                    <span>{server.usage} calls</span>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Open Source Tab */}
        <TabsContent value="opensource" className="space-y-4 mt-6">
          <h3 className="text-xl font-semibold mb-4">Your Open Source Contributions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.openSourceAssets.map(asset => (
              <Card key={asset.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground block text-sm">Downloads</span>
                      <span className="font-medium">{asset.downloads.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-sm">Stars</span>
                      <span className="font-medium">{asset.stars}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">View Repository</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Call Logs Tab */}
        <TabsContent value="calls" className="space-y-4 mt-6">
          <h3 className="text-xl font-semibold mb-4">Call Logs</h3>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Asset</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Duration</th>
                      <th className="text-left p-4">Tokens</th>
                      <th className="text-left p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.callLogs.map(log => (
                      <tr key={log.id} className="border-b">
                        <td className="p-4">{log.assetName}</td>
                        <td className="p-4">{log.date}</td>
                        <td className="p-4">{log.duration}</td>
                        <td className="p-4">{log.tokens}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Token Details Tab */}
        <TabsContent value="tokens" className="space-y-4 mt-6">
          <h3 className="text-xl font-semibold mb-4">Token Incentives</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earning Breakdown</CardTitle>
                <CardDescription>How you've earned tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>AI Agent Usage</span>
                    <span className="font-medium">750 tokens</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>MCP Server Usage</span>
                    <span className="font-medium">980 tokens</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Open Source Contributions</span>
                    <span className="font-medium">720 tokens</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between items-center">
                    <span className="font-medium">Total Pending</span>
                    <span className="font-medium">{userData.pendingTokens} tokens</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Claim Tokens</CardTitle>
                <CardDescription>Transfer tokens to your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-md flex items-center justify-between">
                    <div>
                      <span className="block font-medium">Available to claim</span>
                      <span className="text-2xl font-bold">{userData.pendingTokens} tokens</span>
                    </div>
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  
                  {!account ? (
                    <Button onClick={handleConnectWallet} className="w-full">
                      Connect Wallet to Claim
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleClaimTokens} 
                      disabled={claimInProgress || userData.pendingTokens === 0}
                      className="w-full"
                    >
                      {claimInProgress ? "Processing..." : "Claim All Tokens"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
