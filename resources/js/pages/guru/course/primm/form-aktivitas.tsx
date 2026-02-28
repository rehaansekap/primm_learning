import React, { useState, useEffect, ChangeEvent } from "react";
import { Plus, Trash2, Save, ArrowLeft, Upload, Code2, CheckCircle2, X, Monitor } from "lucide-react"; 
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Soal {
    id: number;
    teks: string;
    pembahasan: string;
}

interface BlokAktivitas {
    id: number;
    preview: string | null;
    gambar: File | null;
    link_colab?: string; 
    daftar_soal: Soal[];
}

export default function FormAktivitas({ materi, tahap, primm }: { materi: any; tahap: string; primm?: any }) {
    const { flash } = usePage().props as any;
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    
    const getInitialData = () => {
        const rawData = primm?.[tahap.toLowerCase()];
        
        if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
            return [{ 
                id: Date.now(), 
                preview: null, 
                gambar: null, 
                link_colab: "", 
                daftar_soal: [{ id: Date.now() + 1, teks: "", pembahasan: "" }] 
            }];
        }

        return rawData.map((d: any) => ({
            id: d.id,
            preview: d.gambar ? `/storage/${d.gambar}` : null,
            gambar: null,
            link_colab: d.link_colab || "",
            daftar_soal: d.questions && d.questions.length > 0 
                ? d.questions.map((q: any) => ({ 
                    id: q.id, 
                    teks: q.pertanyaan,
                    pembahasan: q.pembahasan || "" // Ambil data pembahasan dari DB
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        daftarBlok.forEach((blok, index) => {
          
            if (blok.id && blok.id < 1000000000000) {
                formData.append(`blok[${index}][id]`, blok.id.toString());
            }

            formData.append(`blok[${index}][link_colab]`, blok.link_colab || "");

            blok.daftar_soal.forEach((soal, sIndex) => {
                if (soal.teks.trim() !== "") {
                    formData.append(`blok[${index}][pertanyaan][${sIndex}][teks]`, soal.teks);
                    formData.append(`blok[${index}][pertanyaan][${sIndex}][pembahasan]`, soal.pembahasan || "");
                    if (soal.id && soal.id < 1000000000000) {
                        formData.append(`blok[${index}][pertanyaan][${sIndex}][id]`, soal.id.toString());
                    }
                }
            });

            // Handle Gambar
            if (blok.gambar instanceof File) {
                formData.append(`gambar_${index}`, blok.gambar);
            } else if (blok.preview) {
                // Jika tidak ganti gambar, kirim path gambar lama agar tidak hilang
                formData.append(`blok[${index}][existing_gambar]`, blok.preview.replace('/storage/', ''));
            }
        });

        router.post(`/guru/course/${materi.id}/primm/${tahap}/store`, formData, {
            forceFormData: true,
            onSuccess: () => {
                // Otomatis pindah ke halaman listPrimm setelah sukses
                router.visit(`/guru/course/primm/list-primm/${materi.id}?judul=${encodeURIComponent(materi.judul)}`);
            }
        });
    };

    // 3. Fungsi Helper (Tambah/Hapus Blok & Soal)
    const tambahBlok = () => {
        setDaftarBlok([...daftarBlok, { 
            id: Date.now(), 
            preview: null, 
            gambar: null, 
            link_colab: "", 
            daftar_soal: [{ id: Date.now() + 1, teks: "", pembahasan: "" }]
        }]);
    };

    const hapusBlok = (index: number) => {
        if (daftarBlok.length > 1) {
            setDaftarBlok(daftarBlok.filter((_, i) => i !== index));
        }
    };
    
    const updateLinkColab = (bIndex: number, value: string) => {
        setDaftarBlok(prev => prev.map((blok, i) => 
            i === bIndex ? { ...blok, link_colab: value } : blok
        ));
    };

    const tambahSoal = (bIndex: number) => {
        setDaftarBlok(prev => prev.map((blok, i) => 
            i === bIndex ? { ...blok, daftar_soal: [...blok.daftar_soal, { id: Date.now(), teks: "", pembahasan: "" }] } : blok
        ));
    };

    const updateTeksSoal = (bIndex: number, sIndex: number, value: string) => {
        setDaftarBlok(prev => prev.map((blok, i) => {
            if (i !== bIndex) return blok;
            const soalBaru = blok.daftar_soal.map((soal, j) => 
                // Pertahankan ID soal agar Laravel tahu soal mana yang sedang diedit
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

    const hapusSoal = (bIndex: number, sIndex: number) => {
        setDaftarBlok(prev => prev.map((blok, i) => {
            if (i !== bIndex) return blok;
            if (blok.daftar_soal.length <= 1) return blok; 
            return { ...blok, daftar_soal: blok.daftar_soal.filter((_, j) => j !== sIndex) };
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
                {/* Notifikasi Sukses */}
                {showSuccessMsg && (
                    <div className="max-w-3xl mx-auto mb-6">
                        <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-[20px] flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-emerald-600" />
                            <span className="font-semibold text-[14px]">{flash?.success}</span>
                        </div>
                    </div>
                )}
                
                {/* Header */}
                <div className="max-w-3xl mx-auto mb-8 flex justify-between items-end">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg">
                            <Code2 className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">{namaTahap}</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manajemen Aktivitas PRIMM</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 mb-12">
                    {daftarBlok.map((blok, bIndex) => (
                        <div key={blok.id} className="relative bg-white border border-gray-200 rounded-[40px] shadow-sm p-8 space-y-8">
                            
                            {daftarBlok.length > 1 && (
                                <button type="button" onClick={() => hapusBlok(bIndex)} className="absolute top-6 right-8 text-gray-300 hover:text-red-500">
                                    <X className="w-6 h-6" />
                                </button>
                            )}

                            <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Blok Aktivitas #{bIndex + 1}
                            </div>

                            {/* 1. MEDIA SECTION */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px]">1</span>
                                    Gambar Kode Program
                                </label>
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-100 rounded-[30px] bg-gray-50/50 cursor-pointer overflow-hidden relative group">
                                    {blok.preview ? (
                                        <img src={blok.preview} className="w-full h-full object-contain p-6" alt="Preview" />
                                    ) : (
                                        <div className="text-center opacity-40">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-[10px] font-black uppercase tracking-tighter">Klik untuk Unggah Gambar</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleGambar(e, bIndex)} />
                                </label>
                            </div>

                            {/* 2. QUESTION SECTION - Perbaikan loop di sini */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="bg-emerald-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px]">2</span>
                                    Daftar Pertanyaan & Pembahasan
                                </label>
                                
                                <div className="space-y-4">
                                    {blok.daftar_soal.map((soal, sIndex) => (
                                        <div key={soal.id} className="flex gap-4 items-start p-4 rounded-[30px] hover:bg-gray-50/50 transition-all border border-transparent hover:border-gray-100">
                                            <span className="mt-4 font-bold text-emerald-500 min-w-[25px]">
                                                {bIndex + 1}{String.fromCharCode(97 + sIndex)}.
                                            </span>

                                            <div className="flex-1 space-y-3">
                                                <textarea 
                                                    value={soal.teks}
                                                    onChange={(e) => updateTeksSoal(bIndex, sIndex, e.target.value)}
                                                    className="w-full p-5 bg-white border border-gray-100 rounded-[20px] text-xs focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none shadow-sm"
                                                    placeholder="Tulis pertanyaan..."
                                                    rows={2}
                                                />
                                                <div className="relative">
                                                    <textarea 
                                                        value={soal.pembahasan || ""}
                                                        onChange={(e) => updatePembahasanSoal(bIndex, sIndex, e.target.value)}
                                                        className="w-full p-5 bg-emerald-50/30 border border-emerald-100 rounded-[20px] text-xs text-emerald-900 focus:ring-4 focus:ring-emerald-500/10 outline-none"
                                                        placeholder="Tulis kunci pembahasan edukasi teknis..."
                                                        rows={2}
                                                    />
                                                    <div className="absolute -top-2 left-4 px-2 bg-white border border-emerald-100 rounded-full">
                                                        <span className="text-[8px] font-black text-emerald-600 uppercase">Kunci Pembahasan</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {blok.daftar_soal.length > 1 && (
                                                <button type="button" onClick={() => hapusSoal(bIndex, sIndex)} className="mt-10 p-2 text-gray-300 hover:text-red-500">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                <button type="button" onClick={() => tambahSoal(bIndex)} className="flex items-center gap-2 font-bold text-[10px] uppercase text-emerald-600 ml-10">
                                    <Plus className="w-4 h-4" /> Tambah Soal untuk Gambar Ini
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end gap-4 pb-12">
                        <Link href={`/guru/course/primm/list-primm/${materi.id}`} className="px-8 py-4 bg-gray-600 text-white rounded-2xl font-black text-[12px] uppercase">
                            Batal
                        </Link>
                        <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[12px] uppercase shadow-xl hover:bg-blue-700 transition-all">
                            <Save className="w-4 h-4 inline mr-2" /> Simpan Aktivitas
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}