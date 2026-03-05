import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Monitor, Trophy, BookOpen, UserCircle, ChevronRight, Info } from 'lucide-react';

interface Props {
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
    stats: {
        totalMateri: number;
        totalAktivitas: number;
        progresSiswa: number;
        hasilAkhir: number;
    };
}

export default function DashboardSiswa({ auth, stats }: Props) {

    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        
        const hasSeen = sessionStorage.getItem('welcome_shown');
        if (!hasSeen) {
            setShowWelcome(true);
        }
    }, []);

    const closeWelcome = () => {
        setShowWelcome(false);
        sessionStorage.setItem('welcome_shown', 'true');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Siswa', href: '/siswa/dashboard' }]}>
            <Head title="Dashboard Siswa" />

                {showWelcome && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border border-white animate-in zoom-in duration-300">
                        <div className="bg-white p-8 text-black text-center relative">
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <Info size={40} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight relative">INFO PENTING!</h3>
                            <p className="text-black text-sm mt-1 relative">Alur penggunaan aplikasi:</p>
                        </div>
                        
                        <div className="p-4 space-y-3">
                            <div className="flex gap-4">
                                <p className="text-sm text-slate-600">1. Silahkan <b>Test</b> terlebih dahulu jika belum.</p>
                            </div>
                            <div className="flex gap-4">
                                <p className="text-sm text-slate-600">2. Lanjutkan ke <b>Edit Profil</b> jika ingin memperbarui data diri Anda.</p>
                            </div>
                            <div className="flex gap-4">
                                <p className="text-sm text-slate-600">3. Pilih menu <b>Course</b> untuk mulai belajar .</p>
                            </div>
                            <div className="flex gap-4 border-t border-dashed">
                                <p className="text-sm text-slate-600 font-medium">4. Cek <b>Grade</b> untuk melihat hasil belajar.</p>
                            </div>
                            <div className="flex gap-4 border-t border-dashed">
                                <p className="text-sm text-slate-600 font-medium">5. Jangan lupa wajib <b>Logout</b> setiap pembelajaran selesai.</p>
                            </div>
                            

                            <button 
                                onClick={closeWelcome}
                                className="w-full mt-4 py-3 bg-[#0F828C] hover:bg-[#0d6d74] text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                 Mengerti <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-10 bg-[#F8FAFC] min-h-screen font-sans">
                <div className="mb-10">
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                        Halo, <span className="text-blue-600">{auth.user.name}</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Selamat belajar dan semoga sukses 
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#B3E5FC] p-5 rounded-[22px] flex items-center justify-between shadow-sm border border-white/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                    <div>
                        <div className="text-4xl font-black text-[#01579B] leading-none mb-1">
                            {stats.totalMateri}
                        </div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-[#01579B]/80">Materi</div>
                    </div>
                    <div className="bg-white/40 p-3 rounded-2xl shadow-inner">
                        <BookOpen size={32} className="text-[#01579B]" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="bg-[#F7CA89] p-5 rounded-[22px] flex items-center justify-between shadow-sm border border-white/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                    <div>
                        <div className="text-3xl font-black text-[#BF360C] leading-none mb-2">
                            {stats?.progresSiswa || 0} / <span className="text-xl text-[#BF360C]/60">{stats?.totalAktivitas || 0}</span>
                        </div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-[#BF360C]/80">Aktivitas</div>
                    </div>
                    <div className="bg-white/40 p-3 rounded-2xl shadow-inner">
                        <Monitor size={32} className="text-[#BF360C]" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="bg-[#BBF7D0] p-5 rounded-[22px] flex items-center justify-between shadow-sm border-2 border-[#86EFAC] transition-transform hover:scale-[1.02]">
                    <div>
                        <h2 className="text-4xl font-black text-[#166534] leading-none mb-1">
                            {stats.hasilAkhir}
                        </h2>
                        <p className="text-[#166534] font-black uppercase tracking-widest text-[11px]">
                            Nilai Akhir
                        </p>
                    </div>
                    <div className="bg-white/40 p-2.5 rounded-xl">
                        <Trophy size={32} className="text-[#166534]" strokeWidth={2.5} />
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}