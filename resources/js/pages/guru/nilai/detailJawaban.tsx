import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Save, MessageSquare, ChevronLeft, User, Code2, Terminal, Info, CheckCircle2 } from "lucide-react";

interface GradingForm {
    scores: Record<number, string | number>;
    feedbacks: Record<number, string>;
}

export default function DetailJawaban({ student, answers, currentMateri }: any) {
    const { data, setData, post, processing } = useForm<GradingForm>({
        scores: answers.reduce((acc: any, ans: any) => ({ ...acc, [ans.id]: ans.skor || 0 }), {}),
        feedbacks: answers.reduce((acc: any, ans: any) => ({ ...acc, [ans.id]: ans.feedback || "" }), {}),
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
            onSuccess: () => alert(`Nilai materi ${currentMateri} berhasil disimpan!`),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Daftar Nilai', href: '/guru/nilai/daftarNilai' },
        { title: 'Daftar Materi', href: `/guru/nilai/siswa/${student.id}/materi` },
        { title: 'Detail Jawaban', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Menilai ${student.name}`} />
            
            <div className="p-4 md:p-6 bg-[#F8FAFC] min-h-screen font-sans">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <Link 
                            href={`/guru/nilai/siswa/${student.id}/courses`}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-all font-bold text-xs"
                        >
                            <ChevronLeft size={16} /> Kembali
                        </Link>
                    </div>
                    <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-none">{student.name}</h2>
                            <p className="text-slate-400 text-[10px] mt-1 uppercase font-bold tracking-widest">{currentMateri}</p>
                        </div>
                    </div>
                    <div className="space-y-10">
                        {answers.map((ans: any, index: number) => {
                            const isNewActivity = index === 0 || ans.question?.primm?.id !== answers[index - 1].question?.primm?.id;
                            const isCodingStage = ['modify', 'make'].includes(ans.question?.primm?.tahap?.toLowerCase());

                            return (
                                <div key={ans.id} className="relative transition-all">
                                    
                                    {isNewActivity && (
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="px-3 py-1 bg-[#0F828C]/50 text-white text-[9px] font-black rounded-md uppercase tracking-[0.1em]">
                                                {ans.question?.primm?.tahap}
                                            </div>
                                            <div className="h-px flex-1 bg-slate-200"></div>
                                        </div>
                                    )}

                                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden border-b-4 border-b-[#0F828C]/50">
                                        
                                         <p className="text-slate-700 font-bold text-sm leading-relaxed px-5 pt-4 whitespace-pre-wrap">
                                            {ans.question?.pertanyaan}
                                        </p>
                                        <div className="p-5 space-y-4">
                                            {ans.question?.primm?.kode_program && (
                                                <div className="rounded-xl overflow-hidden border border-slate-800 shadow-sm">
                                                    <div className="bg-slate-800 px-3 py-1 flex items-center gap-2 border-b border-slate-700">
                                                        <Code2 size={12} className="text-slate-500" />
                                                        <span className="text-[10px] text-slate-400 font-mono tracking-widest">soal.py</span>
                                                    </div>
                                                    <div className="bg-[#1e1e1e] p-4 overflow-x-auto max-h-[200px]">
                                                        <pre className="font-mono text-[12px] leading-relaxed text-blue-300">
                                                            <code>{ans.question.primm.kode_program}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-5 pb-5 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Terminal size={14} className="text-emerald-500" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Respon Siswa</span>
                                            </div>

                                            {isCodingStage ? (
                                                <div className="rounded-xl overflow-hidden border border-emerald-500/20 shadow-sm">
                                                    <div className="bg-slate-900 px-3 py-1 flex items-center justify-between border-b border-white/5">
                                                        <span className="text-[10px] text-emerald-500 font-mono font-bold tracking-widest">student_code.py</span>
                                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                                    </div>
                                                    <div className="bg-[#1e1e1e] p-4 overflow-x-auto">
                                                        <pre className="font-mono text-[12px] leading-relaxed text-emerald-400 whitespace-pre-wrap">
                                                            <code>{ans.kode_program || "# Kosong"}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[#166534]">
                                                    <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">
                                                        {ans.jawaban_siswa && ans.jawaban_siswa !== 'session_coding' ? ans.jawaban_siswa : '(Tidak ada jawaban)'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                                            <div className="w-full sm:w-24">
                                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1.5 tracking-wider">Skor</label>
                                                <input 
                                                    type="number" 
                                                    value={data.scores[ans.id]}
                                                    max="100"
                                                    onChange={(e) => handleScoreChange(ans.id, e.target.value)}
                                                    className="w-full bg-white border-slate-200 rounded-lg font-black text-center text-lg h-10 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1.5 tracking-wider">Feedback Singkat</label>
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        <MessageSquare size={14} />
                                                    </div>
                                                    <input 
                                                        type="text"
                                                        value={data.feedbacks[ans.id]}
                                                        onChange={(e) => handleFeedbackChange(ans.id, e.target.value)}
                                                        className="w-full bg-white border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                                                        placeholder="Beri saran..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-12 flex justify-end pb-10">
                        <button 
                            onClick={handleSaveAll}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {processing ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={16} strokeWidth={3} /> 
                            )}
                            <span>{processing ? 'Menyimpan...' : 'Simpan Semua'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}