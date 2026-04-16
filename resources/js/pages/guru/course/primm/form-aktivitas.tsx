import React, { useState, useEffect, ChangeEvent } from "react";
import { Plus, Trash2, Save, ArrowLeft, Upload, Code2, CheckCircle2, X, Play } from "lucide-react"; 
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface Soal {
    id: number;
    teks: string;
    pembahasan: string;
}

interface BlokAktivitas {
    id: number;
    preview: string | null;
    gambar: File | null;
    kode_program: string; 
    daftar_soal: Soal[];
}

export default function FormAktivitas({ materi, tahap, primm }: { materi: any; tahap: string; primm?: any }) {
    const { flash } = usePage().props as any;
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    
    // State untuk Pyodide
    const [pyodide, setPyodide] = useState<any>(null);
    const [outputTest, setOutputTest] = useState<{ [key: number]: string }>({});
    const [isTesting, setIsTesting] = useState<number | null>(null);

    // Inisialisasi Pyodide
    useEffect(() => {
        async function loadPy() {
            if ((window as any).loadPyodide && !pyodide) {
                const py = await (window as any).loadPyodide();
                setPyodide(py);
            }
        }
        loadPy();
    }, []);

    const getInitialData = () => {
        const rawData = primm?.[tahap.toLowerCase()];
        if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
            return [{ 
                id: Date.now(), 
                preview: null, 
                gambar: null, 
                kode_program: "", 
                daftar_soal: [{ id: Date.now() + 1, teks: "", pembahasan: "" }] 
            }];
        }

        return rawData.map((d: any) => ({
            id: d.id,
            preview: d.gambar ? `/storage/${d.gambar}` : null,
            gambar: null,
            kode_program: d.kode_program || "", 
            daftar_soal: d.questions && d.questions.length > 0 
                ? d.questions.map((q: any) => ({ 
                    id: q.id, 
                    teks: q.pertanyaan,
                    pembahasan: q.pembahasan || "" 
                  }))
                : [{ id: Date.now(), teks: "", pembahasan: "" }]
        }));
    };

    const [daftarBlok, setDaftarBlok] = useState<BlokAktivitas[]>(getInitialData());
    const namaTahap = tahap.charAt(0).toUpperCase() + tahap.slice(1);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessMsg(true);
            const timer = setTimeout(() => setShowSuccessMsg(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    // FUNGSI UTAMA: JALANKAN KODE DENGAN DUKUNGAN INPUT()
    const handleTestRun = async (bIndex: number, code: string) => {
        if (!pyodide) return alert("Mesin Python sedang disiapkan...");
        setIsTesting(bIndex);
        try {
            // Setup Bridge agar input() Python memanggil window.prompt() browser
            const setupInputCode = `
        import sys
        import io
        from js import window

        def input(prompt=""):
            return window.prompt(prompt)

        sys.stdout = io.StringIO()
        `;
            // Jalankan setup dan kode utama
            await pyodide.runPythonAsync(setupInputCode);
            await pyodide.runPythonAsync(code || "print('Tidak ada kode')");
            
            const out = pyodide.runPython("sys.stdout.getvalue()");
            setOutputTest(prev => ({ ...prev, [bIndex]: out || "Program Berhasil (Tanpa Output)" }));
        } catch (err: any) {
            setOutputTest(prev => ({ ...prev, [bIndex]: "Error: " + err.message }));
        }
        setIsTesting(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        daftarBlok.forEach((blok, index) => {
            if (blok.id && blok.id < 1000000000000) {
                formData.append(`blok[${index}][id]`, blok.id.toString());
            }
            formData.append(`blok[${index}][kode_program]`, blok.kode_program || "");
            blok.daftar_soal.forEach((soal, sIndex) => {
                if (soal.teks.trim() !== "") {
                    formData.append(`blok[${index}][pertanyaan][${sIndex}][teks]`, soal.teks);
                    formData.append(`blok[${index}][pertanyaan][${sIndex}][pembahasan]`, soal.pembahasan || "");
                    if (soal.id && soal.id < 1000000000000) {
                        formData.append(`blok[${index}][pertanyaan][${sIndex}][id]`, soal.id.toString());
                    }
                }
            });
            if (blok.gambar instanceof File) {
                formData.append(`gambar_${index}`, blok.gambar);
            } else if (blok.preview) {
                formData.append(`blok[${index}][existing_gambar]`, blok.preview.replace('/storage/', ''));
            }
        });

        router.post(`/guru/course/${materi.id}/primm/${tahap}/store`, formData, {
            forceFormData: true,
            onSuccess: () => {
                router.visit(`/guru/course/primm/list-primm/${materi.id}?judul=${encodeURIComponent(materi.judul)}`);
            }
        });
    };

    const updateKodeProgram = (bIndex: number, value: string) => {
        setDaftarBlok(prev => prev.map((blok, i) => 
            i === bIndex ? { ...blok, kode_program: value } : blok
        ));
    };

    const updateTeksSoal = (bIndex: number, sIndex: number, value: string) => {
        setDaftarBlok(prev => prev.map((blok, i) => {
            if (i !== bIndex) return blok;
            const soalBaru = blok.daftar_soal.map((soal, j) => 
                j === sIndex ? { ...soal, teks: value } : soal
            );
            return { ...blok, daftar_soal: soalBaru };
        }));
    };

    const updatePembahasanSoal = (bIndex: number, sIndex: number, value: string) => {
        setDaftarBlok(prev => prev.map((blok, i) => {
            if (i !== bIndex) return blok;
            const soalBaru = blok.daftar_soal.map((soal, j) => 
                j === sIndex ? { ...soal, pembahasan: value } : soal
            );
            return { ...blok, daftar_soal: soalBaru };
        }));
    };

    const handleGambar = (e: ChangeEvent<HTMLInputElement>, bIndex: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDaftarBlok(prev => prev.map((blok, i) => 
                    i === bIndex ? { ...blok, preview: reader.result as string, gambar: file } : blok
                ));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: `Aktivitas ${namaTahap}`, href: '#' }]}>
            <div className="p-6 bg-gray-100 min-h-screen w-full font-sans text-gray-800">
                {showSuccessMsg && (
                    <div className="max-w-3xl mx-auto mb-6 text-center animate-bounce">
                        <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-[20px] inline-flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-emerald-600" />
                            <span className="font-semibold text-[14px]">{flash?.success}</span>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 mb-12">
                    {daftarBlok.map((blok, bIndex) => (
                        <div key={blok.id} className="relative bg-white border border-gray-200 rounded-[40px] shadow-sm p-8 space-y-8">
                            
                            <div className="flex justify-between items-center">
                                <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Blok Aktivitas #{bIndex + 1}
                                </div>
                                {daftarBlok.length > 1 && (
                                    <button type="button" onClick={() => setDaftarBlok(daftarBlok.filter((_, i) => i !== bIndex))} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* EDITOR KODE */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px]">1</span>
                                    Input Kode Program (Soal)
                                </label>
                                <div className=" overflow-hidden border-2 border-gray-100 shadow-xl">
                                    <CodeMirror
                                        value={blok.kode_program || ""}
                                        height="250px"
                                        theme={vscodeDark} 
                                        extensions={[python()]}
                                        onChange={(value) => updateKodeProgram(bIndex, value)}
                                    />
                                    
                                    {/* PANEL RUNNER */}
                                    <div className="bg-[#1e1e1e] p-4 border-t border-gray-700 flex flex-col gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => handleTestRun(bIndex, blok.kode_program)}
                                            className="w-fit px-5 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 transition-all flex items-center gap-2"
                                        >
                                            <Play size={12} fill="currentColor" />
                                            {isTesting === bIndex ? "Memproses..." : "Tes Jalankan Kode"}
                                        </button>
                                        
                                        {outputTest[bIndex] && (
                                            <div className="p-4 bg-black/50 rounded-xl font-mono text-[12px] text-green-400 border border-emerald-900/30">
                                                <p className="text-[8px] text-emerald-500 mb-1 uppercase font-bold tracking-widest">Output Console:</p>
                                                <pre className="whitespace-pre-wrap">{outputTest[bIndex]}</pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* GAMBAR PENDUKUNG */}
                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Upload size={14} className="text-gray-400" />
                                    Gambar Pendukung (Opsional)
                                </label>
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-100 rounded-[30px] bg-gray-50/50 cursor-pointer overflow-hidden group hover:border-emerald-300 transition-all">
                                    {blok.preview ? (
                                        <img src={blok.preview} className="w-full h-full object-contain p-6" alt="Preview" />
                                    ) : (
                                        <div className="text-center opacity-40">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Klik untuk Unggah Gambar</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleGambar(e, bIndex)} />
                                </label>
                            </div>

                            {/* PERTANYAAN */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px]">2</span>
                                    Daftar Pertanyaan
                                </label>
                                {blok.daftar_soal.map((soal, sIndex) => (
                                    <div key={soal.id} className="p-6 bg-gray-50/50 rounded-[30px] border border-gray-100 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-blue-600 text-xs">Pertanyaan {sIndex + 1}</span>
                                            {blok.daftar_soal.length > 1 && (
                                                <button type="button" onClick={() => {
                                                    const soalBaru = blok.daftar_soal.filter((_, i) => i !== sIndex);
                                                    setDaftarBlok(daftarBlok.map((b, i) => i === bIndex ? {...b, daftar_soal: soalBaru} : b));
                                                }} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                                            )}
                                        </div>
                                        <textarea 
                                            value={soal.teks}
                                            onChange={(e) => updateTeksSoal(bIndex, sIndex, e.target.value)}
                                            className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-xs focus:ring-4 focus:ring-emerald-500/10 outline-none"
                                            placeholder="Tulis pertanyaan..."
                                        />
                                        <div className="relative">
                                            <textarea 
                                                value={soal.pembahasan || ""}
                                                onChange={(e) => updatePembahasanSoal(bIndex, sIndex, e.target.value)}
                                                className="w-full p-4 bg-blue-50 border border-emerald-100 rounded-2xl text-xs text-black focus:ring-4 focus:ring-emerald-500/10 outline-none"
                                                placeholder="Kunci jawaban..."
                                            />
                                            <div className="absolute -top-2 left-4 px-2 bg-white border border-emerald-100 rounded-full text-[8px] font-black text-blue-600 uppercase">Kunci</div>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => setDaftarBlok(daftarBlok.map((b, i) => i === bIndex ? {...b, daftar_soal: [...b.daftar_soal, {id: Date.now(), teks: "", pembahasan: ""}]} : b))} className="text-[10px] font-bold text-blue-600 flex items-center gap-1"><Plus size={14}/> Tambah Pertanyaan</button>
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col gap-4">
                        <button type="button" onClick={() => setDaftarBlok([...daftarBlok, {id: Date.now(), preview: null, gambar: null, kode_program: "", daftar_soal: [{id: Date.now()+1, teks: "", pembahasan: ""}]}])} className="w-full py-6 border-2 border-dashed border-blue-200 rounded-[40px] text-blue-600 font-black uppercase text-[12px] hover:bg-emerald-50 transition-all">+ Tambah Blok Aktivitas</button>
                        
                        <div className="flex justify-end gap-4">
                            <Link href={`/guru/course/primm/list-primm/${materi.id}`} className="px-8 py-4 bg-gray-600 text-white rounded-2xl font-black text-[12px] uppercase">Batal</Link>
                            <button type="submit" className="bg-blue-600 text-white px-5 py-4 rounded-2xl font-black text-[12px] uppercase shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
                                <Save size={16} /> Simpan Semua
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}