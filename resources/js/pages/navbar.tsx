import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '../components/app-logo-icon';
import { Menu, X } from "lucide-react";

export default function Navbar({ canRegister = true }: { canRegister?: boolean }) {
  const page = usePage<SharedData>();
  const auth = page.props.auth;
  const { url } = usePage();

  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

useEffect(() => {
  const sectionIds = ['home', 'guide', 'about', 'contact'];
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const id = entry.target.id;
          setActiveSection(id);

          const newHash = id === 'home' ? window.location.pathname : `#${id}`;
          if (window.location.hash !== newHash) {
            window.history.replaceState(null, '', newHash);
          }
        }
      });
    },
    { 
      threshold: [0.3, 0.5], 
      rootMargin: "-80px 0px -50% 0px" 
    }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

    return () => observer.disconnect();
  }, []);

    const isUrlActive = (path: string) => {
      if (path === '/') return url === '/';
      return url.startsWith(path);
    };

  return (
    <header  className="fixed top-0 inset-x-0 w-full z-50 bg-[#0F828C] text-white border-b border-[#0d6d74]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 gap-6">
        <div className="flex items-center">
          <AppLogoIcon className="size-7 text-white" />
          <span className="ml-2 text-lg font-semibold">PrimmLearn</span>
        </div>

        <button 
          className="lg:hidden p-2 text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <span className="text-2xl">✕</span> 
          ) : (
            <span className="text-2xl">☰</span> 
          )}
        </button>

        <div className={`
          fixed lg:static top-[65px] left-0 w-full lg:w-auto 
          bg-[#0F828C] lg:bg-transparent 
          flex flex-col lg:flex-row items-center gap-4 p-6 lg:p-0
          transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'}
          border-b border-[#0d6d74] lg:border-none
        `}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className={`w-full lg:w-auto px-4 py-1.5 ${activeSection === 'home' ? 'bg-[#78B9B5]' : ''}`} onClick={() => setIsMenuOpen(false)}>
            <a href="#home">Beranda</a>
          </Button>

          <Button variant="ghost" asChild className={`w-full lg:w-auto px-4 py-1.5 ${activeSection === 'guide' ? 'bg-[#78B9B5]' : ''}`} onClick={() => setIsMenuOpen(false)}>
            <a href="#guide">Petunjuk</a>
          </Button>

          <Button variant="ghost" asChild className={`w-full lg:w-auto px-4 py-1.5 ${activeSection === 'about' ? 'bg-[#78B9B5]' : ''}`} onClick={() => setIsMenuOpen(false)}>
            <a href="#about">Tentang</a>
          </Button>

          <Button variant="ghost" asChild className={`w-full lg:w-auto px-4 py-1.5 ${activeSection === 'contact' ? 'bg-[#78B9B5]' : ''}`} onClick={() => setIsMenuOpen(false)}>
            <a href="#contact">Kontak</a>
          </Button>

          <div className="h-[1px] lg:h-6 w-full lg:w-[1px] bg-white/20 my-2 lg:mx-2" />

          <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto"></div>
          {auth?.user ? (
            <Button
                variant="ghost"
                className="w-full lg:w-auto px-4 py-1.5 bg-[#78B9B5] hover:bg-[#68a6a2] text-white"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
              <Link href={auth.user.role === 'guru' ? '/guru/dashboard' : '/siswa/dashboard'}>
                  Dashboard
                </Link>
            </Button>
          ) : (
            <>
              <Button 
                  variant="ghost" 
                  className={`w-full lg:w-auto px-4 py-1.5 ${isUrlActive('/login') && 'bg-[#78B9B5]'}`} 
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/login">Login</Link>
                </Button>

              {canRegister && (
                <Button 
                    variant="ghost" 
                    className={`w-full lg:w-auto px-4 py-1.5 ${isUrlActive('/register') && 'bg-[#78B9B5]'}`} 
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/register">Daftar</Link>
                  </Button>
              )}
            </>
          )}
          </div>
        </div>
      </nav>
    </header>
  );
}
