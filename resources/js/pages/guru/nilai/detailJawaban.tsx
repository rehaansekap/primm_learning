import React from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Save, User, MessageSquare } from "lucide-react";

export default function DetailJawaban({ student, answers }: any) {
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
                alert('Semua nilai dan feedback berhasil disimpan!');
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Daftar Nilai', href: '/guru/nilai/daftarNilai' },
        { title: 'Detail Jawaban', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Penilaian - ${student.name}`} />
            
            <div className="p-8 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl p-6 mb-8 border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Penilaian Siswa</p>
                                <h1 className="text-2xl font-bold text-blue-600 tracking-tight uppercase">
                                    {student.name}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {answers.map((ans: any) => (
                        <div key={ans.id} className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm overflow-hidden">
                            <div className="mb-4">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg border border-indigo-100 uppercase">
                                    Fase: {ans.question?.primm?.tahap || 'Umum'}
                                </span>
                            </div>
                            
                            <div className="space-y-4 mb-6">
                                {ans.question?.primm?.gambar && (
                                    <div className="mb-4 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 p-2">
                                        <img 
                                            src={`/storage/${ans.question.primm.gambar}`} 
                                            alt="Gambar Aktivitas" 
                                            className="w-full h-auto max-h-30 object-contain mx-auto rounded-xl"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Pertanyaan:</label>
                                    <p className="text-slate-800 font-medium">{ans.question?.pertanyaan}</p>
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                        Jawaban Siswa:
                                    </label>
                                    <pre className="bg-emerald-50 text-black p-4 rounded-xl text-sm font-mono mt-1 border-l-4 border-emerald-500 whitespace-pre-wrap break-words overflow-visible">
                                        {ans.jawaban_siswa}
                                    </pre>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Skor (0-100)</label>
                                        <input 
                                            type="number" 
                                            defaultValue={ans.skor}
                                            onChange={(e) => handleScoreChange(ans.id, e.target.value)}
                                            className="w-full bg-white border-slate-200 rounded-xl focus:ring-blue-500 font-bold"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="md:col-span-3 w-full"> 
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                            Feedback Guru <span className="text-slate-400 font-normal lowercase"></span>
                                        </label>
                                        <div className="flex w-full rounded-xl shadow-sm  overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 bg-white transition-all">
                                            <span className="flex items-center justify-center px-4 text-slate-400">
                                                <MessageSquare size={18} />
                                            </span>
                                            <input 
                                                type="text"
                                                defaultValue={ans.feedback}
                                                onChange={(e) => handleFeedbackChange(ans.id, e.target.value)}
                                                className="flex-1 border-none bg-transparent focus:border-transparent py-3 px-4 text-sm focus:ring-0 placeholder:text-slate-400 text-slate-700"
                                                placeholder="Ketik feedback atau catatan di sini..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSaveAll}
                            disabled={processing}
                            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
                        >
                            <Save size={18} />
                            {processing ? 'Menyimpan...' : 'Konfirmasi & Simpan Semua'}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}