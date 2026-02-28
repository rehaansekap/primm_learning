import React, { useState } from "react"; 
import { Link, Head } from '@inertiajs/react';
import { 
    Lock, CheckCircle2, Monitor, ChevronRight, 
    Telescope, PlayCircle, SearchCode, Pencil, Cpu, BookOpen, Users, 
    ArrowRight
} from "lucide-react";
import AppLayout from '@/layouts/app-layout';

export default function ListPrimm({ course, progress }: any) {
    const [showInstructions, setShowInstructions] = useState(true);

    const steps = ["predict", "run", "investigate", "modify", "make"];

    const stepIcons = [Telescope, PlayCircle, SearchCode, Pencil, Cpu];

    const deskripsiTahap = [
        "Ayoo belajar memprediksi program dengan fun",
        "Ayoo belajar menjalankan program apakah sesuai tebakan",
        "Ayoo belajar menelusuri program dengan fun",
        "Ayoo belajar memodifikasi program dengan fun",
        "Ayoo belajar membuat program dengan fun"
    ];

    return (
        <AppLayout breadcrumbs={[{ title: course.title, href: '#' }]}>
            <Head title={`Daftar Tahap - ${course.title}`} />
            
            <div className="w-full mx-auto p-4 md:p-10">
                
                {showInstructions ? (
                   <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-500 text-left">
                        <div className="bg-blue-200 rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-200 border border-gray-100 relative overflow-hidden">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Panduan Aktivitas PRIMM</h2>
                                <p className="text-gray-500 mt-2 font-s">Baca petunjuk dan langkah pengerjaan sebelum memulai pengerjaan.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-l font-bold text-gray-800 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black">A</div>
                                        Petunjuk Pengerjaan
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { text: "Kerjakan LKPD sesuai dengan instruksi secara berkelompok yang sudah ditentukan.", icon: Users },
                                            { text: "Perhatikan soal pada aplikasi, diskusikan bersama teman sekelompokmu.", icon: BookOpen },
                                            { text: "Pastikan setiap anggota kelompok berkontribusi aktif selama diskusi.", icon: CheckCircle2 },
                                            { text: "Periksa kembali jawaban sebelum dikirim untuk memastikan kesalahan.", icon: CheckCircle2 }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 items-start">
                                                <item.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <p className="text-gray-600 text-sm font-semibold leading-relaxed">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-l font-bold text-gray-800 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">B</div>
                                        Langkah Kegiatan
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { t: "Kerjakan kegiatan Mempredikasi kode program", i: Telescope, c: "bg-amber-500" },
                                            { t: "Lalu, kerjakan pada kegiatan Menjalankan program", i: PlayCircle, c: "bg-emerald-500" },
                                            { t: "Kemudian, kerjakan pada kegiatan Menelusuri program", i: SearchCode, c: "bg-blue-500" },
                                            { t: "Selanjutnya, kerjakan pada kegiatan Memodifikasi program", i: Pencil, c: "bg-purple-500" },
                                            { t: "Setelah itu, kerjakan pada kegiatan Mmebuat program", i: Cpu, c: "bg-rose-500" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                                <div className={`w-8 h-8 ${item.c} text-white rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                    <item.i size={16} />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">{i+1}. {item.t}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className="px-5 py-3 bg-[#0F828C] hover:bg-[#0d6d74] text-white rounded-xl font-bold text-md transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 active:scale-95"
                                >
                                     MULAI <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-10 text-left">
                            <h1 className="text-3xl font-black text-black uppercase tracking-tighter">
                                Materi : <span className="text-blue-600">{course.title}</span>
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium">
                                Selesaikan tahapan secara berurutan untuk menguasai materi ini.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            {steps.map((step, index) => {
                                const isFirstStep = index === 0;
                                const previousStep = steps[index - 1];
                                const isUnlocked = isFirstStep || progress[previousStep];
                                const isCompleted = progress[step];

                                return (
                                    <div 
                                        key={step} 
                                        className={`group relative flex items-center p-5 rounded-[25px] border-2 transition-all duration-300 ${
                                            isUnlocked 
                                            ? 'border-[#F7CA89] bg-white shadow-sm hover:shadow-md' 
                                            : 'border-grey-100 bg-gray-50 opacity-70'
                                        }`}
                                    >
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                                            isCompleted 
                                            ? 'bg-emerald-500 text-white' 
                                            : isUnlocked 
                                            ? 'bg-[#F7CA89]/10 text-[#F7CA89]' 
                                            : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-7 h-7" />
                                            ) : isUnlocked ? (
                                                <Monitor className="w-7 h-7" />
                                            ) : (
                                                <Lock className="w-6 h-6" />
                                            )}
                                        </div>

                                        <div className="ml-6 flex-grow text-left">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                                                    Tahap 0{index + 1}
                                                </span>
                                                <h3 className={`text-lg font-bold uppercase tracking-tight ${
                                                    isUnlocked ? 'text-gray-800' : 'text-gray-400'
                                                }`}>
                                                    {step}
                                                </h3>
                                                <div className="mt-2 flex items-center gap-2">
                                                    {(() => {
                                                        const IconComponent = stepIcons[index];
                                                        return (
                                                            <IconComponent 
                                                                size={18} 
                                                                className={`${isUnlocked ? 'text-indigo-500' : 'text-gray-300'}`} 
                                                            />
                                                        );
                                                    })()}

                                                    <p className={`text-sm font-medium leading-tight ${
                                                        isUnlocked ? 'text-blue-600' : 'text-gray-400'
                                                    }`}>
                                                        { deskripsiTahap[index]}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-4">
                                            {isUnlocked ? (
                                                <Link 
                                                    href={`/siswa/courseSiswa/showPrimm/${course.id}/${step}`}
                                                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                                                        isCompleted 
                                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                                        : 'bg-[#0F828C] text-white hover:bg-[#0d6d74] shadow-lg shadow-emerald-100'
                                                    }`}
                                                >
                                                    <ChevronRight className="w-6 h-6" />
                                                </Link>
                                            ) : (
                                                <div className="w-12 h-12 flex items-center justify-center text-gray-300">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}