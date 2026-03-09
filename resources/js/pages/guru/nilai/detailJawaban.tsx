import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Save, MessageSquare, ChevronLeft, User } from "lucide-react";

export default function DetailJawaban({ student, answers, currentMateri }: any) {
    console.log("Data yang diterima React:", answers);
    const { data, setData, post, processing } = useForm({
        scores: {} as Record<number, string | number>,
        feedbacks: {} as Record<number, string>,
    });

    const handleScoreChange = (id: number, value: string) => {
        setData('scores', { ...data.scores, [id]: value });
    };

    const handleFeedbackChange = (id: number, value: string) => {
        setData('feedbacks', { ...data.feedbacks, [id]: value });
    };

    const handleSaveAll = () => {
        post(`/grading/bulk-update/${student.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                alert(`Nilai untuk materi ${currentMateri} berhasil disimpan!`);
            },
            onError: (errors) => {
                console.error("Gagal menyimpan:", errors);
                alert("Terjadi kesalahan saat menyimpan nilai.");
            }
        });
    };
        const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Daftar Nilai', href: '/guru/nilai/daftarNilai' },
        { title: 'Daftar Materi', href: `/guru/nilai/siswa/${student.id}/materi` },
        { title: 'Detail Jawaban', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Menilai ${currentMateri} - ${student.name}`} />
            
            <div className="p-8 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-start mb-4">     
                        <Link 
                            href={`/guru/nilai/siswa/${student.id}/courses`}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-xs rounded-xl hover:bg-slate-700 transition-all font-bold shadow-sm active:scale-95"
                        >
                            <ChevronLeft size={16} /> 
                            <span>Kembali ke Daftar Materi</span>
                        </Link>
                    </div>

                    <div className="mb-6 bg-white p-6 rounded-3xl shadow-xl border">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                                <User size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-blue-600 uppercase tracking-tight leading-none mb-1">
                                    {currentMateri}
                                </h2>
                                <p className="text-black text-sm font-medium">
                                     <span className="text-blue-600 font-bold text-[20px] ">{student.name}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {answers.map((ans: any, index: number) => {
                            const isNewActivity = index === 0 || ans.question?.primm?.id !== answers[index - 1].question?.primm?.id;

                            return (
                                <div key={ans.id} className="animate-in fade-in duration-500">

                                    {isNewActivity && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md shadow-blue-100">
                                                    Fase: {ans.question?.primm?.tahap || 'Umum'}
                                                </span>
                                                <div className="h-[1px] flex-1 bg-slate-200"></div>
                                            </div>

                                            {ans.question?.primm?.gambar && (
                                                <div className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm text-center mb-6 overflow-hidden">
                                                    <img 
                                                        src={`/storage/${ans.question.primm.gambar}`} 
                                                        alt="Visual Soal" 
                                                        className="mx-auto object-contain rounded-[3px] max-w-[200px] md:max-w-md lg:max-w-lg lg:max-w-xl"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-8 space-y-6">
                                            <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-blue-500">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Pertanyaan:</label>
                                                <p className="text-slate-800 font-bold text-sm leading-relaxed">
                                                    {ans.question?.pertanyaan}
                                                </p>
                                            </div>
                                            
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Jawaban Siswa:</label>
                                                <pre className="bg-emerald-50 text-emerald-900 p-6 rounded-2xl text-xs font-mono border border-emerald-100 whitespace-pre-wrap break-words leading-relaxed">
                                                    {ans.jawaban_siswa || '(Siswa tidak mengisi jawaban)'}
                                                </pre>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="md:col-span-1">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 text-center">Skor (0-100)</label>
                                                        <input 
                                                            type="number" 
                                                            value={ans.skor}
                                                            max="100"
                                                            onChange={(e) => handleScoreChange(ans.id, e.target.value)}
                                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-black text-center text-xl h-14 transition-all"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 ml-1">Feedback Guru</label>
                                                        <div className="flex w-full rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all h-14">
                                                            <span className="flex items-center px-4 text-slate-400 border-r border-slate-200">
                                                                <MessageSquare size={18} />
                                                            </span>
                                                            <input 
                                                                type="text"
                                                                value={ans.feedback}
                                                                onChange={(e) => handleFeedbackChange(ans.id, e.target.value)}
                                                                className="flex-1 border-none bg-transparent py-3 px-4 text-sm focus:ring-0 font-medium"
                                                                placeholder="Beri apresiasi atau catatan perbaikan..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 flex justify-end sticky bottom-8">
                        <button 
                            onClick={handleSaveAll}
                            disabled={processing}
                            className="flex items-center gap-3 px-2 py-3 bg-emerald-600 text-white rounded-[6px] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl disabled:opacity-50 disabled:translate-y-0 active:scale-95"
                        >
                            <Save size={20} />
                            {processing ? 'Sedang Menyimpan...' : 'Simpan Semua Nilai Materi'}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}