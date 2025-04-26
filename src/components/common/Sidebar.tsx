import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: {
    content: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export interface SidebarProps {
  brandInfo: {
    name: string;
    logo?: string;
  };
  navigation: NavItem[];
  userInfo?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
  className?: string;
  defaultCollapsed?: boolean;
}

interface NavItemProps extends NavItem {
  collapsed: boolean;
  active: boolean;
}

const NavItemComponent = ({ icon, label, href, badge, collapsed, active }: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={href} className="block">
            <Button
              variant={active ? "secondary" : "ghost"}
              className={cn(
                "w-full transition-all duration-200 ease-in-out",
                collapsed ? "justify-center px-2" : "justify-start px-4",
                active && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              size={collapsed ? "icon" : "default"}
            >
              <span className={cn(
                "flex items-center gap-3",
                collapsed && "justify-center"
              )}>
                {icon}
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 truncate"
                  >
                    {label}
                  </motion.span>
                )}
              </span>
              {!collapsed && badge && (
                <span className={cn(
                  "ml-auto rounded-full px-2 py-0.5 text-xs font-medium",
                  badge.variant === 'destructive' && "bg-destructive/10 text-destructive",
                  badge.variant === 'secondary' && "bg-secondary/10 text-secondary",
                  badge.variant === 'outline' && "border border-border",
                  badge.variant === 'default' && "bg-primary/10 text-primary"
                )}>
                  {badge.content}
                </span>
              )}
            </Button>
          </Link>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="flex items-center gap-2">
            {label}
            {badge && (
              <span className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                badge.variant === 'destructive' && "bg-destructive/10 text-destructive",
                badge.variant === 'secondary' && "bg-secondary/10 text-secondary",
                badge.variant === 'outline' && "border border-border",
                badge.variant === 'default' && "bg-primary/10 text-primary"
              )}>
                {badge.content}
              </span>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export function Sidebar({
  brandInfo,
  navigation,
  userInfo,
  onLogout,
  className,
  defaultCollapsed = false,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Save collapsed state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col gap-4">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={brandInfo.logo} alt={brandInfo.name} />
                <AvatarFallback>{brandInfo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-semibold truncate">{brandInfo.name}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {navigation.map((item) => (
          <NavItemComponent
            key={item.href}
            {...item}
            collapsed={isCollapsed}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      {/* User Section */}
      {userInfo && (
        <div className="border-t p-4">
          <AnimatePresence initial={false}>
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                    <AvatarFallback>
                      {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{userInfo.name}</p>
                    {userInfo.email && (
                      <p className="truncate text-xs text-muted-foreground">
                        {userInfo.email}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                {onLogout && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-10 w-10 cursor-pointer">
                        <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                        <AvatarFallback>
                          {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{userInfo.name}</p>
                      {userInfo.email && (
                        <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {onLogout && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={onLogout}
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Logout</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-4 md:hidden">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={brandInfo.logo} alt={brandInfo.name} />
            <AvatarFallback>{brandInfo.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{brandInfo.name}</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden border-r bg-background transition-all duration-300 ease-in-out md:flex md:flex-col",
          isCollapsed ? "md:w-16" : "md:w-72",
          className
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
} 