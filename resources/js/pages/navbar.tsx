import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '../components/app-logo-icon';

export default function Navbar({ canRegister = true }: { canRegister?: boolean }) {
  const page = usePage<SharedData>();
  const auth = page.props.auth;
  const { url } = usePage();

  const [activeSection, setActiveSection] = useState('home');

useEffect(() => {
  const sectionIds = ['home', 'guide', 'about', 'contact'];
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const id = entry.target.id;
          setActiveSection(id);

          // --- TAMBAHKAN KODE INI ---
          // Ini akan mengubah URL tanpa me-reload halaman
          const newHash = id === 'home' ? window.location.pathname : `#${id}`;
          if (window.location.hash !== newHash) {
            window.history.replaceState(null, '', newHash);
          }
          // --------------------------
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

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className={`px-4 py-1.5 ${activeSection === 'home' ? 'bg-[#78B9B5]' : ''}`}>
            <a href="#home">Beranda</a>
          </Button>

          {/* Tombol Petunjuk */}
          <Button variant="ghost" asChild className={`px-4 py-1.5 ${activeSection === 'guide' ? 'bg-[#78B9B5]' : ''}`}>
            <a href="#guide">Petunjuk</a>
          </Button>

          {/* Tombol Tentang */}
          <Button variant="ghost" asChild className={`px-4 py-1.5 ${activeSection === 'about' ? 'bg-[#78B9B5]' : ''}`}>
            <a href="#about">Tentang</a>
          </Button>

          {/* Tombol Kontak */}
          <Button variant="ghost" asChild className={`px-4 py-1.5 ${activeSection === 'contact' ? 'bg-[#78B9B5]' : ''}`}>
            <a href="#contact">Kontak</a>
          </Button>

          <div className="h-6 w-[1px] bg-white/20 mx-2 hidden sm:block" />

          {auth?.user ? (
            <Button
              variant="ghost"
              className="px-4 py-1.5 bg-[#78B9B5] hover:bg-[#68a6a2] text-white"
              asChild
            >
              <Link href={auth.user.role === 'guru' ? '/guru/dashboard' : '/siswa/dashboard'}>
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className={`px-4 py-1.5 ${isUrlActive('/login') && 'bg-[#78B9B5]'}`} 
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>

              {canRegister && (
                <Button 
                  variant="ghost" 
                  className={`px-4 py-1.5 ${isUrlActive('/register') && 'bg-[#78B9B5]'}`} 
                  asChild
                >
                  <Link href="/register">Daftar</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
