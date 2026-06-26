import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import InfinityLogo from '@/components/InfinityLogo.jsx';

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border pt-20 pb-10">
      <div className="container-luxury">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/"
            className="mb-6">
              <InfinityLogo showGlow={false} />
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Transcend boundaries. Empowering movement, mindset, and holistic self-expression for the high-achiever.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 lg:col-start-7">
            <span className="text-xs font-semibold block mb-6 tracking-[0.15em] uppercase text-muted-foreground">
              Platform
            </span>
            <div className="flex flex-col gap-4">
              <Link href="/about" className="text-foreground hover:text-accent transition-colors duration-300 font-medium w-fit">
                Philosophy
              </Link>
              <Link href="/pricing-coaching" className="text-foreground hover:text-accent transition-colors duration-300 font-medium w-fit">
                Memberships
              </Link>
              <Link href="/calculator" className="text-foreground hover:text-accent transition-colors duration-300 font-medium w-fit">
                Nutrition Calculator
              </Link>
              <Link href="/login" className="text-foreground hover:text-accent transition-colors duration-300 font-medium w-fit">
                Client Portal
              </Link>
            </div>
          </div>

          {/* Socials */}
          <div className="lg:col-span-3">
            <span className="text-xs font-semibold block mb-6 tracking-[0.15em] uppercase text-muted-foreground">
              Connect
            </span>
            <div className="flex gap-6">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-foreground bg-card hover:border-accent hover:text-accent hover:shadow-sm transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-foreground bg-card hover:border-accent hover:text-accent hover:shadow-sm transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-foreground bg-card hover:border-accent hover:text-accent hover:shadow-sm transition-all duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium tracking-wide">
            © {new Date().getFullYear()} Limitless Motion. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300 tracking-wide">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300 tracking-wide">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;