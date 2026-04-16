import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Users, Monitor, BookOpen, Activity, ChevronRight, GraduationCap, CheckCircle } from 'lucide-react';

interface Props {
    auth: {
        user: { name: string; };
    };
    stats: {
        totalSiswa: number;
        totalAktivitas: number;
        totalMateri: number;
    };
}

export default function DashboardGuru({ auth, stats }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Guru', href: '/guru/dashboard' }]}>
            <Head title="Dashboard Guru" />

            <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-black text-slate-800">
                                HALLO, Bapak/Ibu <span className="text-[#0F828C] uppercase">{auth?.user?.name || 'Guru'}</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
                            Selamat mengajar di pelajaran pemrograman. Pantau progres belajar siswa Anda hari ini.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Siswa"
                        value={stats.totalSiswa || 0}
                        subtitle="Siswa dalam kelas"
                        icon={<Users className="text-blue-600" />}
                        iconBg="bg-blue-100"
                        trendColor="text-blue-500"
                    />

                    <StatCard 
                        title="Total Aktivitas"
                        value={stats.totalAktivitas || 0}
                        subtitle="Tugas & Praktikum"
                        icon={<Monitor className="text-emerald-600" />}
                        iconBg="bg-emerald-100"
                        trendColor="text-emerald-500"
                    />

                    <StatCard 
                        title="Total Materi"
                        value={stats.totalMateri || 0}
                        subtitle="Course tersedia"
                        icon={<BookOpen className="text-blue-600" />}
                        iconBg="bg-blue-100"
                        trendColor="text-blue-500"
                    />

                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, subtitle, icon, iconBg, trendColor }: any) {
    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 transition-all duration-300 ease-out cursor-default group 
            hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 hover:border-white">
            
            <div className="flex justify-between items-start mb-4">
                <div className={`${iconBg} p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
                </div>
                <div className={`p-1.5 rounded-lg bg-slate-50 ${trendColor} transition-colors group-hover:bg-white`}>
                    <Activity size={14} strokeWidth={3} />
                </div>
            </div>

            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 transition-colors group-hover:text-slate-400">
                    {title}
                </p>
                <h3 className="text-3xl font-black text-slate-800 mb-1 group-hover:text-slate-900">
                    {value}
                </h3>
                <p className="text-slate-400 text-[11px] font-semibold">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}