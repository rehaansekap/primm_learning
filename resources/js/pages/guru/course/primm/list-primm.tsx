import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, BookOpen, Monitor, ArrowLeft, Edit, Eye, X, Play } from "lucide-react"; 
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface Question {
    id: number;
    pertanyaan: string;
    pembahasan?: string;
}

interface PrimmBlock {
    id: number;
    gambar: string | null;
    kode_program: string | null; 
    questions: Question[];
}

interface PrimmRecord {
    [key: string]: PrimmBlock[] | null; 
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola PRIMM', href: '/guru/course/' },
];

export default function ListPrimm({ materi, primm }: { materi: any; primm: PrimmRecord }) {
    const judulMateri = materi?.judul || "Materi Tidak Diketahui";
    const [tahapTerbuka, setTahapTerbuka] = useState<string | null>(null);
    
    // State untuk Pyodide & Output Preview
    const [pyodide, setPyodide] = useState<any>(null);
    const [previewOutput, setPreviewOutput] = useState<{ [key: number]: string }>({});
    const [isLoadingPy, setIsLoadingPy] = useState(false);

    const [previewModal, setPreviewModal] = useState<{
        tahap: string; 
        open: boolean; 
        blocks: PrimmBlock[] 
    }>({
        tahap: '', 
        open: false, 
        blocks: [] 
    });

    // Inisialisasi Pyodide saat modal dibuka
    useEffect(() => {
        if (previewModal.open && !pyodide) {
            async function loadPy() {
                setIsLoadingPy(true);
                if ((window as any).loadPyodide) {
                    const py = await (window as any).loadPyodide();
                    setPyodide(py);
                }
                setIsLoadingPy(false);
            }
            loadPy();
        }
    }, [previewModal.open]);

    // Fungsi Run dengan Bridge Input agar input() muncul popup browser
    const handlePreviewRun = async (bIdx: number, code: string) => {
        if (!pyodide) return alert("Mesin Python sedang disiapkan...");
        
        try {
            const setupInputCode = `
        import sys
        import io
        from js import window

        def input(prompt=""):
            return window.prompt(prompt)

        sys.stdout = io.StringIO()
        `;
            await pyodide.runPythonAsync(setupInputCode);
            await pyodide.runPythonAsync(code || "print('Tidak ada kode')");
            
            const out = pyodide.runPython("sys.stdout.getvalue()");
            setPreviewOutput(prev => ({ ...prev, [bIdx]: out || "Program Berhasil (Tanpa Output)" }));
        } catch (err: any) {
            setPreviewOutput(prev => ({ ...prev, [bIdx]: "Error: " + err.message }));
        }
    };

    const tahapan = ["Predict", "Run", "Investigate", "Modify", "Make"];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-10 bg-gray-50 min-h-screen w-full font-sans text-gray-800">
                
                <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Link 
                        href={`/guru/course`} 
                        className="group inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-all mb-4"
                    >
                        <div className="p-1.5 rounded-full bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider">Kembali</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                                Manajemen <span className="text-emerald-600">PRIMM</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span className="text-xs font-bold uppercase tracking-wide">
                                        Materi: <span className="ml-1 text-emerald-900">{judulMateri}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="max-w-full space-y-4">
                    {tahapan.map((item) => {
                        const dataBlocks = primm[item.toLowerCase()];
                        const isExist = dataBlocks && dataBlocks.length > 0;

                        return (
                            <div key={item} className="bg-white border-2 border-gray-100 rounded-[35px] overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <button 
                                    onClick={() => setTahapTerbuka(tahapTerbuka === item ? null : item)}
                                    className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${isExist ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                                            <Monitor className={`w-5 h-5 ${isExist ? 'text-emerald-600' : 'text-orange-500'}`} />
                                        </div>
                                        <span className="font-black text-gray-700 uppercase tracking-tight">{item}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isExist && <span className="text-[10px] font-bold bg-emerald-600 text-white px-3 py-1 rounded-full uppercase">Aktif</span>}
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${tahapTerbuka === item ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${tahapTerbuka === item ? 'max-h-full border-t-2 border-gray-50' : 'max-h-0'}`}>
                                    <div className="p-6 space-y-4 bg-gray-50/50">
                                        {isExist ? (
                                            <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-100 border-b">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left font-bold text-gray-700 w-12">No</th>
                                                            <th className="px-4 py-3 text-left font-bold text-gray-700">Ringkasan Aktivitas</th>
                                                            <th className="px-4 py-3 text-center font-bold text-gray-700 w-24">Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        <tr className="hover:bg-gray-50 transition">
                                                            <td className="px-4 py-3 text-gray-600 font-semibold">1</td>
                                                            <td className="px-4 py-3 text-gray-600">
                                                                <span className="font-bold text-emerald-600">{dataBlocks.length} Blok Kode</span>
                                                                <span className="mx-2 text-gray-300">|</span>
                                                                <span className="text-gray-500 font-medium">Total {dataBlocks.reduce((acc, curr) => acc + (curr.questions?.length || 0), 0)} Pertanyaan</span>
                                                            </td>
                                                            <td className="px-4 py-3 flex gap-1.5 justify-center">
                                                                <button
                                                                    onClick={() => {
                                                                        setPreviewOutput({}); // Reset output saat buka preview baru
                                                                        setPreviewModal({tahap: item, open: true, blocks: dataBlocks});
                                                                    }}
                                                                    className="p-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                </button>
                                                                <Link 
                                                                    href={`/guru/course/primm/${item.toLowerCase()}/aktivitas?course_id=${materi.id}&judul=${encodeURIComponent(materi.judul)}`}
                                                                    className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-6">
                                                <p className="text-gray-400 italic mb-4">Belum ada aktivitas untuk tahap ini</p>
                                                <Link 
                                                    href={`/guru/course/primm/${item.toLowerCase()}/aktivitas?course_id=${materi.id}&judul=${encodeURIComponent(materi.judul)}`}
                                                    className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition text-xs uppercase tracking-widest"
                                                >
                                                    <Plus className="w-4 h-4" /> Buat Aktivitas Baru
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {previewModal.open && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-[40px] shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                            <div className="px-8 py-6 bg-emerald-600 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Preview Konten & Soal</h3>
                                    <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Tahap PRIMM: {previewModal.tahap}</p>
                                </div>
                                <button onClick={() => setPreviewModal({...previewModal, open: false})} className="p-2 hover:bg-white/20 rounded-full transition">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-10 bg-gray-50/30">
                                {previewModal.blocks.map((blok, bIdx) => (
                                    <div key={bIdx} className="space-y-6 border-b-2 border-gray-200 pb-10 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Aktivitas Blok #{bIdx + 1}</span>
                                        </div>
                                        
                                        {/* Tampilan Kode Program dengan Fitur Run */}
                                        {blok.kode_program && (
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Soal Kode Python:</p>
                                                <div className=" overflow-hidden border-2 border-gray-100 shadow-sm bg-[#1e1e1e]">
                                                    <CodeMirror
                                                        value={blok.kode_program}
                                                        height="200px"
                                                        theme={vscodeDark}
                                                        extensions={[python()]}
                                                        readOnly={true}
                                                    />
                                                    
                                                    {/* TOMBOL RUN DI MODAL */}
                                                    <div className="p-4 border-t border-gray-700 bg-[#1e1e1e] flex flex-col gap-3">
                                                        <button 
                                                            type="button"
                                                            onClick={() => handlePreviewRun(bIdx, blok.kode_program!)}
                                                            disabled={isLoadingPy}
                                                            className="w-fit px-5 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 transition-all flex items-center gap-2"
                                                        >
                                                            <Play size={12} fill="currentColor" />
                                                            {isLoadingPy ? "Menyiapkan Python..." : "Jalankan Preview"}
                                                        </button>
                                                        
                                                        {/* OUTPUT PREVIEW */}
                                                        {previewOutput[bIdx] && (
                                                            <div className="p-4 bg-black/50 rounded-xl font-mono text-[12px] text-green-400 border border-emerald-900/30">
                                                                <p className="text-[8px] text-emerald-500 mb-1 uppercase font-bold tracking-widest">Output Console:</p>
                                                                <pre className="whitespace-pre-wrap">{previewOutput[bIdx]}</pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {blok.gambar && (
                                            <div className="space-y-3">
                                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gambar Pendukung:</p>
                                                <div className="rounded-[30px] border-2 border-gray-100 p-3 bg-white shadow-inner">
                                                    <img 
                                                        src={blok.gambar.startsWith('/storage') ? blok.gambar : `/storage/${blok.gambar}`} 
                                                        alt="Preview Kode" 
                                                        className="mx-auto rounded-[3px] object-contain max-h-[300px]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid gap-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Daftar Pertanyaan:</p>
                                            {blok.questions.map((q, qIdx) => (
                                                <div key={q.id} className="space-y-3"> 
                                                    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                        <span className="font-black text-emerald-600 text-sm">
                                                            {bIdx + 1}{String.fromCharCode(97 + qIdx)}.
                                                        </span>
                                                        <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                                                            {q.pertanyaan}
                                                        </p>
                                                    </div>

                                                    {q.pembahasan && (
                                                        <div className="ml-8 p-6 bg-slate-900 rounded-xl border-l-4 border-amber-400 shadow-sm">
                                                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-3">
                                                            Kunci & Pembahasan:
                                                        </span>
                                                        <div className="relative">
                                                            {/* Menggunakan pre agar format spasi/enter dari database terjaga */}
                                                            <pre className="text-sm text-slate-200 leading-relaxed font-mono overflow-x-auto p-2 whitespace-pre-wrap break-words">
                                                            <code>{q.pembahasan}</code>
                                                            </pre>
                                                        </div>
                                                        </div>
                                                    )}
                                                </div> 
                                            ))} 
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}