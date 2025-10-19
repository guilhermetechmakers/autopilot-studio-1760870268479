import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  FileText,
  CheckSquare,
  Calendar,
  DollarSign,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Proposals", href: "/proposals", icon: FileText },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Billing", href: "/billing", icon: DollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-card"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-sidebar border-r border-border",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {sidebarOpen ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-accent-green" />
                  <span className="font-bold">Autopilot Studio</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="hidden lg:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mx-auto"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-accent-green/10 text-accent-green hover:bg-accent-green/20",
                      !sidebarOpen && "justify-center"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    !sidebarOpen && "justify-center px-2"
                  )}
                >
                  <Avatar className={cn("h-8 w-8", sidebarOpen && "mr-3")}>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  {sidebarOpen && (
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-muted">john@example.com</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  placeholder="Search projects, tasks, or proposals..."
                  className="pl-10 bg-card"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent-red rounded-full" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
