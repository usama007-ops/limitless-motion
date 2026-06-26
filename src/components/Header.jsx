'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, Flame, Activity, Compass, Apple, MessageCircle, LogIn, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import InfinityLogo from '@/components/InfinityLogo.jsx';
import { cn } from '@/lib/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicNavLinks = [
    { name: 'Philosophy', path: '/about', icon: Compass },
    { name: 'Membership', path: '/pricing-coaching', icon: Activity },
    { name: 'Apparel', path: '/apparel', icon: ShoppingBag },
  ];

  const authenticatedNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Burn', path: '/burn', icon: Flame },
    { name: 'Fuel', path: '/fuel', icon: Apple },
    { name: 'Align', path: '/align', icon: Compass },
    { name: 'Community', path: '/community', icon: MessageCircle },
    { name: 'Apparel', path: '/apparel', icon: ShoppingBag },
  ];

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;
  const isActive = (path) => pathname.startsWith(path) && path !== '/' || (path === '/' && pathname === '/');

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 border-b",
        scrolled 
          ? "bg-background/95 backdrop-blur-md border-border shadow-sm py-3" 
          : "bg-background/80 backdrop-blur-sm border-transparent py-5"
      )}
    >
      <nav className="container-luxury">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="z-50">
            <InfinityLogo className={cn("transition-all duration-300", scrolled && "scale-90 origin-left")} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "flex items-center gap-2 text-xs font-semibold uppercase transition-all duration-300 tracking-[0.1em]",
                      active ? "text-primary" : "text-muted-foreground hover:text-accent"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", active && "text-primary")} />
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </div>
            
            <div className="flex items-center gap-4 pl-8 border-l border-border">
              {!isAuthenticated ? (
                <Button asChild className="rounded-md bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-[0_4px_15px_rgba(212,175,55,0.2)] font-semibold tracking-[0.05em] uppercase transition-all duration-300 px-6">
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Member Login
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="flex items-center justify-center w-9 h-9 rounded-md bg-card border border-border text-foreground hover:border-accent hover:text-accent transition-all">
                    <User className="w-4 h-4" />
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground px-3 rounded-md hover:bg-card">
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden z-50 text-foreground hover:text-accent transition-colors p-2"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={cn(
          "fixed inset-0 bg-background/98 backdrop-blur-xl flex flex-col pt-32 px-8 transition-all duration-500 lg:hidden",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}>
          <div className="flex flex-col gap-6 overflow-y-auto pb-20">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={cn(
                    "flex items-center gap-4 text-xl font-semibold uppercase tracking-[0.1em] transition-colors duration-300 p-4 rounded-md border border-transparent",
                    isActive(link.path) ? "bg-card border-border text-primary" : "text-foreground hover:bg-card hover:border-border hover:text-accent"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  {link.name}
                </Link>
              )
            })}
            
            <div className="w-full h-px bg-border my-6"></div>
            
            {!isAuthenticated ? (
              <Button asChild size="lg" className="w-full rounded-md bg-accent text-accent-foreground hover:bg-accent/90 font-semibold uppercase tracking-[0.1em] h-14">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <LogIn className="w-5 h-5 mr-2" /> Member Login
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col gap-4">
                <Button asChild variant="outline" size="lg" className="w-full rounded-md border border-muted text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground font-semibold uppercase tracking-[0.1em] h-14">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-5 h-5 mr-2" /> My Profile
                  </Link>
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="lg" className="w-full rounded-md font-semibold uppercase tracking-[0.1em] text-muted-foreground hover:bg-card hover:text-foreground h-14">
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;