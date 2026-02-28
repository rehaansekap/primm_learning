import { NavMain } from '@/components/nav-main';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import {  logout } from '@/routes';
import { type NavItem } from '@/types';
import AppLogo from './app-logo';
import home from '@/assets/home.png';
import profil from '@/assets/account.png';
import test from '@/assets/test.png';
import course from '@/assets/course2.png';
import grade from '@/assets/grade.png';
import guide from '@/assets/guide.png';
import feedback from '@/assets/feedback2.png';
import signout from '@/assets/signout.png';
import { Pencil } from 'lucide-react';
import { Link, usePage } from "@inertiajs/react";

export function AppSidebar() {

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

type PageProps = {
  auth?: {
    user?: AuthUser;
  };
};

const { auth } = usePage<PageProps>().props;

const userRole = auth?.user?.role;

const siswaNavItems: NavItem[] = [
  { title: 'Home', href: '/siswa/dashboard', icon: <img src={home} className="w-5 h-5" /> },
  { title: 'Profil', href: '/edit-profil', icon: <img src={profil} className="w-6 h-6" /> },
  // { title: 'Guidebook', href: '/guide', icon: <img src={guide} className="w-5 h-5" /> },
  { title: 'Test', href: '/siswa/testSiswa', icon: <img src={test} className="w-6 h-6" /> },
  { title: 'Course', href: '/siswa/courseSiswa', icon: <img src={course} className="w-5 h-5" /> },
  { title: 'Grade', href: '/siswa/nilaiSiswa', icon: <img src={grade} className="w-6 h-6" /> },
  // { title: 'Refleksi', href: '/siswa/feedback', icon: <img src={feedback} className="w-5 h-5" /> },
];

const guruNavItems: NavItem[] = [
  { title: 'Home', href: '/guru/dashboard', icon: <img src={home} className="w-5 h-5" /> },
  { title: 'Profil', href: '/edit-profil', icon: <img src={profil} className="w-6 h-6" /> },
  { title: 'Data Siswa', href: '/guru/list-siswa', icon: <img src={profil} className="w-6 h-6" /> },
  { title: 'Kelola Test', href: '/guru/test', icon: <img src={test} className="w-6 h-6" /> },
  { title: 'Kelola Course', href: '/guru/course', icon: <img src={course} className="w-5 h-5" /> },
  { title: 'Kelola Nilai', href: '/guru/nilai', icon: <img src={grade} className="w-6 h-6" /> },
];


const footerNavItems: NavItem[] = [
    {
        title: 'Logout',
        href: logout(),
        icon: <img src={signout} className="w-6 h-6" />,
    },
    
];

const roleBasedNavItems = [
        ...(userRole === 'guru' ? guruNavItems : siswaNavItems),
        ...footerNavItems,
    ];


    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-[#0F828C]">
            <SidebarHeader className="bg-[#0F828C] " >
              <SidebarMenu >
                  <SidebarMenuItem >
                      {/* <SidebarMenuButton  asChild > */}
                          {/* <Link href={dashboard()} > */}
                              <AppLogo />
                          {/* </Link> */}
                      {/* </SidebarMenuButton> */}
                  </SidebarMenuItem>
              </SidebarMenu>
              
              <div className="mt-4 px-3 py-3 rounded-lg bg-white/10">
                <div className="flex items-center gap-3">
                  
                  <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center font-semibold text-[#0F828C]">
                    {auth?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                 
                  <div className="flex-1 min-w-0 text-white">
                    <p className="text-sm font-semibold truncate">
                      {auth?.user?.name}
                    </p>
                    <p className="text-xs text-white/80 truncate">
                      {auth?.user?.email}
                    </p>
                  </div>
                 
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="bg-[#0F828C]">
                
                <NavMain items={roleBasedNavItems} />
            
            </SidebarContent>

            {/* <SidebarFooter className="bg-[#0F828C]">
                <NavUser />
            </SidebarFooter> */}
        </Sidebar>
    );
}
