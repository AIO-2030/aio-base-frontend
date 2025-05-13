
export interface Agent {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  hasVideo?: boolean;
  subtitle?: string;
  protocolVersion?: string;
  gitRepo?: string;
}

export const caseStudies = [
  {
    id: "cartage",
    title: "How Cartage Automated Customer Reporting",
    description: "Using Wordware, Cartage built a smart agent that can quickly dig into their huge database and give customers the right answers to complex queries—all without needing extra engineering help. This automation significantly improved their customer service and operational efficiency.",
  },
  {
    id: "acme",
    title: "ACME's AI Customer Support Revolution",
    description: "ACME implemented an AI agent that handles 80% of their customer support queries automatically, reducing response time from days to minutes and improving customer satisfaction scores by 45%.",
  }
];

export const agents: Agent[] = [
  {
    id: "job-screening",
    title: "Job Candidate Screening",
    subtitle: "HR & Operations",
    description: "Automate CV-sifting away - spend your time on the best candidates instead! You know the feeling: 1000 resumes and limited time to review them all.",
    category: "HR & Operations",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    hasVideo: true,
    protocolVersion: "v1.2",
    gitRepo: "https://github.com/aio-org/job-screening-agent"
  },
  {
    id: "survey-analyzer",
    title: "Survey Response Analyzer",
    subtitle: "HR & Operations",
    description: "The Survey Response Analyzer is a tool designed to streamline the process of analyzing survey data, specifically for product feedback and customer satisfaction surveys.",
    category: "HR & Operations",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    hasVideo: true,
    protocolVersion: "v1.2",
    gitRepo: "https://github.com/aio-org/survey-response-analyzer"
  },
  {
    id: "competition-analysis",
    title: "Competition research and analysis",
    subtitle: "Research & Education",
    description: "Get list of your competition and instant insights on them. This WordApp - a Wordware application - summarizes your competitors' strengths and weaknesses.",
    category: "Research & Education",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    protocolVersion: "v1.2",
    gitRepo: "https://github.com/aio-org/competition-analysis"
  },
  {
    id: "lego-figure",
    title: "Turn Yourself into a Lego Figure",
    subtitle: "Fun & Lifestyle",
    description: "Ever wondered what you'd look like if you were a Lego minifigure? This fun application turns your photo into a Lego-style character.",
    category: "Fun & Lifestyle",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    hasVideo: true,
    protocolVersion: "v1.2",
    gitRepo: "https://github.com/aio-org/lego-figure-generator"
  },
  {
    id: "landing-page",
    title: "Start-up Landing Page Generator",
    subtitle: "Marketing & Sales",
    description: "Need a new home page? This WordApp will generate and deploy one for you! Instantly create a home and description for your new product.",
    category: "Marketing & Sales",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    hasVideo: true,
    protocolVersion: "v1.2",
    gitRepo: "https://github.com/aio-org/landing-page-generator"
  },
  {
    id: "chatbotify",
    title: "Chatbotify a website",
    subtitle: "Autonomous Agents",
    description: "Reading a website can get pretty dull. How about chatting with its content instead? Turn any website into a friendly AI assistant that can answer questions about it.",
    category: "Autonomous Agents",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    protocolVersion: "v1.2",
    gitRepo: "https://github.com/aio-org/chatbotify"
  },
  {
    id: "data-visualizer",
    title: "Data Visualization Agent",
    subtitle: "Data & Analytics",
    description: "Upload your CSV or Excel files and get beautiful, interactive visualizations instantly. No more struggling with chart settings and formatting.",
    category: "Data & Analytics",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
    hasVideo: true,
    protocolVersion: "v1.2",
    gitRepo: "https://github.com/aio-org/data-visualization-agent"
  },
  {
    id: "code-translator",
    title: "Code Language Translator",
    subtitle: "Development",
    description: "Easily convert your code between programming languages. Translate Python to JavaScript, Java to C#, and many more combinations.",
    category: "Development",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    protocolVersion: "v1.2",
    gitRepo: "https://github.com/aio-org/code-language-translator"
  }
];
