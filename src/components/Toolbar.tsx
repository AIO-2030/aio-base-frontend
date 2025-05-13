import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Plug, Menu, X, Flag } from 'lucide-react';
import AIOLogo from './AIOLogo';
import { usePlugConnect, shortenAddress } from '../lib/plug-wallet';
import { Button } from './ui/button';

const Toolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const { principalId, isConnecting, handleConnectWallet, disconnectWallet } = usePlugConnect();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 0 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } 
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/home/dashboard', label: 'Dashboard' },
    { path: '/home/ai-projects', label: 'Write Paper' },
    { path: '/home/open-source', label: 'Open Source' },
    { path: '/home/best-practices', label: 'Best practices' },
    { path: '/home/agent-store', label: 'Agent Mnemonic' },
    { path: '/home/mcp-store', label: 'MCP Mnemonic' },
    { path: '/home/flag-agent', label: 'Flag Agent' },
  ];

  const currentPath = location.pathname === '/frameworks' ? '/home/mcp-store' : location.pathname;

  const handleProfileClick = () => {
    navigate('/user-dashboard');
    setIsMenuOpen(false);
  };

  const handleWalletClick = () => {
    if (principalId) {
      navigate('/user-dashboard/wallet-settings');
    } else {
      handleConnectWallet();
    }
  };

  return (
    <header 
      className={`border-b border-border/20 bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center h-14">
        {/* Logo positioned at the left */}
        <div className="flex-1 flex items-center">
          <Link to="/home" className="mr-4">
            <AIOLogo size="sm" showText={true} />
          </Link>
          
          {/* Navigation items centered */}
          <nav className="hidden md:block ml-auto">
            <ul className="flex space-x-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`nav-link text-xs ${currentPath === item.path ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Right side items - Profile & Connect Wallet (Download button removed) */}
        <div className="flex items-center ml-4">
          <div 
            className="hidden md:flex items-center cursor-pointer group hover:bg-secondary/50 rounded-full px-2 py-1 transition-colors mr-3"
            onClick={handleProfileClick}
          >
            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
              <User size={14} />
            </div>
            <span className="ml-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">Profile</span>
          </div>
          
          <button 
            className={`flex items-center space-x-2 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              principalId 
                ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                : 'bg-gradient-to-r from-primary/90 to-accent/90 text-white hover:from-primary hover:to-accent'
            }`}
            onClick={handleWalletClick}
            disabled={isConnecting}
          >
            <Plug size={14} />
            <span className="hidden sm:inline">
              {isConnecting 
                ? 'Connecting...' 
                : principalId 
                  ? shortenAddress(principalId) 
                  : 'Connect Plug Wallet'
              }
            </span>
          </button>
          
          <button 
            className="ml-3 md:hidden rounded-md p-2 text-muted-foreground hover:bg-secondary"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border/20 animate-slide-up">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`block py-2 px-3 rounded-md text-xs ${
                      currentPath === item.path 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-secondary/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <div 
                  className="flex items-center py-2 px-3 text-xs text-muted-foreground hover:bg-secondary/50 rounded-md cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <User size={14} className="mr-2" />
                  <span>Profile</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Toolbar;
