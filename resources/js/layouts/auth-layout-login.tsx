import AuthLoginLayout from '@/layouts/auth/auth-simple-layout-login';
import { usePage } from '@inertiajs/react';
export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    
    return (
        <AuthLoginLayout title={title} description={description} {...props}>
            {children}
        </AuthLoginLayout>
    );
}
