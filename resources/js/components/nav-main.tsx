import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url } = usePage(); 

    const isActive = (href: any) => {
        const targetHref = String(href);
        
        const currentPath = url.split('?')[0].split('#')[0];
        const targetPath = targetHref.split('?')[0].split('#')[0];

        if (targetPath.endsWith('/dashboard')) {
            return currentPath === targetPath;
        }

        return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
    };

    return (
        <SidebarGroup className="px-1 py-0 ">
            <SidebarGroupLabel className="text-sm font-semibold text-white/50">Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const active = isActive(item.href);
                    
                    return (
                        <SidebarMenuItem key={String(item.href)}>
                            <SidebarMenuButton
                                asChild
                                className={`
                                    transition-all duration-200
                                    ${active 
                                        ? "bg-[#78B9B5] text-black font-bold shadow-sm" 
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }
                                `}
                            >
                                <Link href={item.href} className="flex items-center gap-3">
                                    <span className={active ? "brightness-0" : ""}>
                                        {item.icon}
                                    </span>
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
