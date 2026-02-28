import { ReactNode } from "react";
import registrasi from '@/assets/registrasi.png';
import { register } from '@/routes';
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import '../../css/login.css';

interface Props {
    title?: string;
    description?: string;
    children: ReactNode;
    canRegister?: boolean;
}

export default function AuthLoginLayout({
    title,
    description,
    children,
    canRegister = true,
}: Props) {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="w-[900px] bg-white shadow-lg flex rounded-lg overflow-hidden">

                <div className="flex-1 p-10 bg-white">
                    {title && (
                        <h1 className="text-3xl font-bold mb-2 text-center">{title}</h1>
                    )}
                    {description && (
                        <p className="text-center text-gray-600 mb-8">{description}</p>
                    )}

                    {children}
                </div>

                <div className="w-1/2 p-10 bg-orange-200 flex flex-col items-center justify-center text-center">
                    <div className="flex justify-center">
                        <img src={registrasi}  
                        alt="registrasi "
                        className="w-full "/>
                    </div>

                    <h2 className="text-2xl font-bold mb-3">Hallo!!!</h2>
                    <h2 className="welcome-title">SELAMAT DATANG</h2>
                    {canRegister && (
                        <>
                            <div className="pb-5 text-center text-sm text-muted-foreground">
                              Jika belum mempunyai akun silahkan daftar dulu yaa!!!
                            </div>

                          <Button asChild className="btnregister">
                            <Link href="/register">
                              DAFTAR
                            </Link>
                          </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

