import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Users, Monitor, BookOpen } from 'lucide-react';

interface Props {
    auth: {
        user: {
            name: string;
        };
    };
    stats: {
        totalSiswa: number;
        totalAktivitas: number;
        totalMateri: number;
        siswaSelesaiSemuaFase: number;
    };
}

export default function DashboardGuru({ auth, stats }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Guru', href: 'guru/dashboard' }]}>
            <Head title="Dashboard Guru" />
            
            <div className="p-10 bg-white min-h-screen">
                
                <div className="mb-10">
                    <h1 className="text-2xl font-medium text-gray-800 tracking-tight">
                        HALLO, Bapak/Ibu <span className="text-emerald-600 font-bold">{auth?.user?.name || 'Guru'}</span>
                    </h1>
                    <p className="text-xl text-gray-800 mt-2">
                        Selamat mengajar di pelajaran pemrograman
                    </p>
                </div>

                <div className="flex flex-wrap gap-6">
                    <div className="w-full md:w-64 bg-[#99CCEA] p-6 rounded-md shadow-md flex items-center justify-between transition-transform hover:scale-105">
                        <div className="flex flex-col items-center">
                            <Users size={48} className="text-[#334488]" strokeWidth={2.5} />
                        </div>
                        <div className="text-right">
                            <span className="text-5xl font-normal text-white block leading-none">{stats?.totalSiswa || 0}</span>
                            <span className="text-lg font-bold text-gray-900 mt-1 block">Siswa</span>
                        </div>
                    </div>

                    <div className="w-full md:w-64 bg-[#F7CA89] p-6 rounded-md shadow-md flex items-center justify-between transition-transform hover:scale-105">
                        <div className="flex flex-col items-center">
                            <Monitor size={48} className="text-gray-700" strokeWidth={1.5} />
                        </div>
                        <div className="text-right">
                            <span className="text-5xl font-normal text-white block leading-none">
                                {stats.totalAktivitas || 0}
                            </span>
                            <span className="text-lg font-bold text-gray-900 mt-1 block">Aktivitas</span>
                        </div>
                    </div>


                      {/* Kartu Materi (Abu-abu) */}
                    <div className="w-full md:w-64 bg-[#D9D9D9] p-6 rounded-md shadow-md flex items-center justify-between transition-transform hover:scale-105">
                        <div className="flex flex-col items-center">
                            <BookOpen size={48} className="text-[#8899CC]" strokeWidth={1.5} />
                        </div>
                        <div className="text-right">
                            <span className="text-5xl font-normal text-white block leading-none">{stats?.totalMateri || 0}</span>
                            <span className="text-lg font-bold text-gray-900 mt-1 block">Materi</span>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}