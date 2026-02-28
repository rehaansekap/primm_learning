import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import '../../css/register.css';
import { login } from '@/routes';
import TextLink from '@/components/text-link';
import kunci from '@/assets/kunci1.png';
import { Button } from '@/components/ui/button';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="page-container">
            <div className="card">

                <div className="left-panel">
                    <div className="flex justify-center">
                        <img src={kunci}  
                        alt="Kunci "
                        className="w-[80%] "/>
                    </div>
                    {/* <Link
                        href={home()}
                        className="flex flex-col items-center gap-3"
                    >
                        <AppLogoIcon className="size-20 fill-current text-[var(--foreground)] dark:text-white" />
                    </Link> */}

                    <h2 className="welcome-title">SELAMAT DATANG</h2>

                    <div className="pb-5 text-center text-sm text-muted-foreground">
                        Jika sudah mempunyai akun, silahkan login ya:){' '}
                    </div>
                    <TextLink href={login()} >
                            <Button className='btnlogin'>Masuk</Button>
                    </TextLink>
                </div>

                <div className="right-panel">

                    <h1 className="form-title">{title}</h1>
                    <p className="desc">{description}</p>

                    <div className="form-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
        
        // <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        //     <div className="w-full max-w-sm">
        //         <div className="flex flex-col gap-8">
        //             <div className="flex flex-col items-center gap-4">
        //                 <Link
        //                     href={home()}
        //                     className="flex flex-col items-center gap-2 font-medium"
        //                 >
        //                     <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
        //                         <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
        //                     </div>
        //                     <span className="sr-only">{title}</span>
        //                 </Link>

        //                 <div className="space-y-2 text-center">
        //                     <h1 className="text-xl font-medium">{title}</h1>
        //                     <p className="text-center text-sm text-muted-foreground">
        //                         {description}
        //                     </p>
        //                 </div>
        //             </div>
        //             {children}
        //         </div>
        //     </div>
        // </div>
    );
}
