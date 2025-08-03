import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  User,
  Menu,
  Shield,
  Zap
} from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-surface border-b border-border shadow-industrial">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Shield className="h-6 w-6 text-industrial-dark" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Asphalt Overwatch
              </h1>
              <p className="text-xs text-muted-foreground">
                Operations Management System
              </p>
            </div>
          </div>
          <Badge className="bg-industrial-orange/20 text-industrial-orange border-industrial-orange">
            <Zap className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-foreground hover:text-industrial-orange">
            Dashboard
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Projects
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Analytics
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Mapping
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Reports
          </Button>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-industrial-orange rounded-full text-xs text-industrial-dark flex items-center justify-center">
              3
            </span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;