
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  BarChart2, 
  CircleUser, 
  Server, 
  ArrowUpRight, 
  FileCode, 
  Network,
  LayoutGrid,
  Activity,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Button } from "@/components/ui/button";

// Mock data for dashboard
const networkData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Aug", value: 4490 },
  { name: "Sep", value: 3490 },
  { name: "Oct", value: 5000 },
  { name: "Nov", value: 4890 },
  { name: "Dec", value: 6000 },
];

const agentActivityData = [
  { name: "Mon", agents: 4000, servers: 2400 },
  { name: "Tue", agents: 3000, servers: 1398 },
  { name: "Wed", agents: 2000, servers: 9800 },
  { name: "Thu", agents: 2780, servers: 3908 },
  { name: "Fri", agents: 1890, servers: 4800 },
  { name: "Sat", agents: 2390, servers: 3800 },
  { name: "Sun", agents: 3490, servers: 4300 },
];

const assetDistribution = [
  { name: "AI Agents", value: 400 },
  { name: "MCP Servers", value: 300 },
  { name: "Libraries", value: 300 },
  { name: "Frameworks", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const networkStats = [
  { title: "Total Nodes", value: "12,456", icon: Network, change: "+12% from last month" },
  { title: "Active Users", value: "8,245", icon: CircleUser, change: "+8% from last month" },
  { title: "Running Servers", value: "1,845", icon: Server, change: "+15% from last month" },
  { title: "Open Source Repos", value: "845", icon: FileCode, change: "+5% from last month" },
];

const MainDashboard = () => {
  const [timeframe, setTimeframe] = useState("7d");
  const { isOnline, isServiceWorkerReady, isEmcNetworkAvailable } = useNetworkStatus();

  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Network Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of network activity, participants, and resources
        </p>
      </div>

      {/* Network Status Alert */}
      {(!isOnline || !isServiceWorkerReady || !isEmcNetworkAvailable) && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Network Connectivity Issue</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>
              {!isOnline 
                ? "Your device appears to be offline. Please check your internet connection." 
                : !isServiceWorkerReady 
                  ? "The service worker is not responding. This might affect network operations."
                  : "EMC Network services are currently unavailable. Some features may be limited."}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Refresh Page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Network Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={isOnline ? "border-green-500" : "border-red-500"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Internet Connection
            </CardTitle>
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{isOnline ? "Online" : "Offline"}</div>
            <p className="text-xs text-muted-foreground">
              {isOnline 
                ? "Your device is connected to the internet" 
                : "Your device is not connected to the internet"}
            </p>
          </CardContent>
        </Card>

        <Card className={isServiceWorkerReady ? "border-green-500" : "border-yellow-500"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Worker
            </CardTitle>
            {isServiceWorkerReady ? (
              <Server className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{isServiceWorkerReady ? "Ready" : "Not Ready"}</div>
            <p className="text-xs text-muted-foreground">
              {isServiceWorkerReady 
                ? "Service worker is active and handling requests" 
                : "Service worker is not responding, some features may be limited"}
            </p>
          </CardContent>
        </Card>

        <Card className={isEmcNetworkAvailable ? "border-green-500" : "border-red-500"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              EMC Network
            </CardTitle>
            {isEmcNetworkAvailable ? (
              <Network className="h-4 w-4 text-green-500" />
            ) : (
              <Network className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{isEmcNetworkAvailable ? "Available" : "Unavailable"}</div>
            <p className="text-xs text-muted-foreground">
              {isEmcNetworkAvailable 
                ? "EMC Network services are available" 
                : "EMC Network services are currently unavailable"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {networkStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Activity and Distribution */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        {/* Network Activity */}
        <Card className="md:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Network Activity
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Tabs defaultValue={timeframe} onValueChange={setTimeframe}>
                  <TabsList>
                    <TabsTrigger value="24h">24h</TabsTrigger>
                    <TabsTrigger value="7d">7d</TabsTrigger>
                    <TabsTrigger value="30d">30d</TabsTrigger>
                    <TabsTrigger value="90d">90d</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={networkData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Distribution */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Asset Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent & Server Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Agents & Servers Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agentActivityData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="agents" fill="hsl(var(--primary))" name="AI Agents" />
                <Bar dataKey="servers" fill="hsl(var(--accent))" name="MCP Servers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full p-2 bg-secondary">
                    {i % 2 === 0 ? (
                      <Server className="h-4 w-4 text-primary" />
                    ) : (
                      <CircleUser className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {i % 2 === 0 ? "MCP Server Deployed" : "Agent Interaction"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">{Math.floor(Math.random() * 100)} tokens</p>
                  <p className="text-xs text-muted-foreground">
                    User{Math.floor(Math.random() * 1000)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainDashboard;
