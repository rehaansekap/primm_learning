import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { logout } from '@/routes';
import { 
  Home, 
  User, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  LogOut, 
  Users 
} from 'lucide-react';
import { Link, usePage } from "@inertiajs/react";

export function AppSidebar() {
  const { props, url } = usePage<any>();
  const { auth } = props;
  const currentUrl = url || '';
  const userRole = auth?.user?.role;

  const navItems = userRole === 'guru' ? [
    { title: 'Home', href: '/guru/dashboard', icon: Home },
    { title: 'Profile', href: '/edit-profil', icon: User },
    { title: 'Data Siswa', href: '/guru/list-siswa', icon: Users },
    { title: 'Kelola Test', href: '/guru/test', icon: FileText },
    { title: 'Kelola Course', href: '/guru/course', icon: BookOpen },
    { title: 'Kelola Nilai', href: '/guru/nilai', icon: GraduationCap },
  ] : [
    { title: 'Home', href: '/siswa/dashboard', icon: Home },
    { title: 'Profile', href: '/edit-profil', icon: User },
    { title: 'Test', href: '/siswa/testSiswa', icon: FileText },
    { title: 'Course', href: '/siswa/courseSiswa', icon: BookOpen },
    { title: 'Grade', href: '/siswa/nilaiSiswa', icon: GraduationCap },
  ];

  return (
    <Sidebar 
      collapsible="icon" 
      variant="inset" 
      className="bg-[#F8F9FA] dark:bg-zinc-950 border-none transition-colors duration-500"
    >
      <SidebarHeader className="p-4">
        {/* Profile Card */}
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all duration-300">
          {/* Initial Avatar */}
          <div className="w-12 h-12 shrink-0 rounded-xl bg-[#0F828C] flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[#0F828C]/20">
            {auth?.user?.name?.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-gray-800 dark:text-zinc-100 truncate">
              {auth?.user?.name}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 truncate">
              {auth?.user?.email}
            </p>
          </div>
          
          {/* Status Online Dot */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>

        <div className="mt-6 px-2 text-left">
          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 tracking-widest uppercase">Menu</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = currentUrl.startsWith(item.href);
            const IconComponent = item.icon;

            return (
              <SidebarMenuItem key={item.title} className="mb-1">
                <SidebarMenuButton
                  asChild
                  className={`h-14 rounded-xl transition-all duration-200 ${
                    isActive 
                    ? "bg-[#E6F4F1] dark:bg-[#0F828C]/20 text-[#0F828C] dark:text-[#14A3AF]" 
                    : "text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <Link href={item.href} className="flex items-center w-full relative group px-3">
                    {/* Ikon Box */}
                    <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
                      isActive 
                      ? "bg-white dark:bg-zinc-800 shadow-md scale-105" 
                      : "bg-gray-100 dark:bg-zinc-800/50 group-hover:scale-105"
                    }`}>
                      <IconComponent 
                        className={`w-5 h-5 transition-colors ${
                          isActive ? "text-[#0F828C] dark:text-[#14A3AF]" : "text-gray-500 dark:text-zinc-500"
                        }`} 
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    
                    <span className="font-semibold text-sm">
                      {item.title}
                    </span>
                    
                    {/* Active Indicator Line */}
                    {isActive && (
                      <div className="absolute -right-2 w-1.5 h-8 bg-[#0F828C] dark:bg-[#14A3AF] rounded-l-full shadow-[0_0_12px_rgba(15,130,140,0.4)]" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {/* Spacer & Logout */}
          <div className="my-4 mx-4 border-t border-gray-100 dark:border-zinc-800" />

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="h-14 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all px-3"
            >
              <Link 
                href={logout().url} 
                method="post" 
                as="button" 
                className="flex items-center w-full text-left group"
              >
                <div className="p-2 rounded-lg mr-3 bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}