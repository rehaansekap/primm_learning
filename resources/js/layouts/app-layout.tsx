import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    hideSidebar?: boolean;
}

export default ({ children, breadcrumbs, hideSidebar = false, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} hideSidebar={hideSidebar} {...props}>
        {children}
    </AppLayoutTemplate>
);