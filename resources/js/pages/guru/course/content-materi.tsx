import React, { useEffect, useState } from "react";
import { Save, Globe, FileUp, Eye, ArrowLeft } from "lucide-react";
import { Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface FormContent {
    id: number;
    judul: string;
    kategori: string;
    deskripsi: string;
    tipe_konten: 'link' | 'file'; 
    embed_code: string;
    file_materi: File | null;
}

const convertYoutubeToEmbed = (url: string): string => {
    if (!url) return '';
    
    if (url.includes('<iframe')) return url;
    
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    
    if (videoId) {
        return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    
    return url; 
};

export default function ContentMateri({ materi }: { materi: any }) {

    const initialType = materi.file ? 'file' : (materi.link ? 'link' : 'link');
    const initialEmbed = materi.link || ''; 
    
    const { data, setData, post, processing } = useForm<FormContent>({
        id: materi.id,
        judul: materi.judul || '',
        kategori: materi.kategori || '',
        deskripsi: materi.deskripsi || '',
        tipe_konten: initialType as 'link' | 'file', 
        embed_code: initialEmbed, 
        file_materi: null,                   
    });
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(`/guru/course/content-materi/${materi.id}`, {
        forceFormData: data.tipe_konten === 'file',
        preserveScroll: true,
      });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Lengkapi Konten', href: '#' }]}>
            <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
                <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6">
                    
                    <div className="flex justify-between items-center ">
                        <Link href="/guru/course" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-all font-bold text-xs uppercase tracking-wider">
                            <ArrowLeft size={16} /> Kembali ke Daftar
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-3">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                                {data.kategori}
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight capitalize">
                                    {data.judul}
                                </h1>
                                
                                <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed">
                                    {data.deskripsi}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white p-2 rounded-[25px] shadow-sm flex gap-2 border border-gray-50">
                                <button 
                                    type="button" 
                                    onClick={() => setData('tipe_konten', 'link')} 
                                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${data.tipe_konten === 'link' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    Link / Embed
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setData('tipe_konten', 'file')} 
                                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${data.tipe_konten === 'file' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    File Materi
                                </button>
                            </div>

                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[350px]">
                                {data.tipe_konten === 'link' ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                                        <div className="text-left">
                                            <label htmlFor="embed_code" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Masukkan Link YouTube atau Kode Embed</label>
                                            <textarea 
                                                id="embed_code"
                                                name="embed_code"
                                                value={data.embed_code}
                                                onChange={(e) => setData('embed_code', e.target.value)}
                                                placeholder="Paste YouTube URL, iframe Genially atau iframe di sini..."
                                                className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[30px] text-[12px] text-gray-700 focus:border-emerald-500 focus:ring-0 transition-all min-h-[200px] outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <label htmlFor="file_materi" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block text-center">Pilih File Materi</label>
                                        <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50 cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-200 transition-all group">
                                            <div className="bg-white p-5 rounded-full shadow-md group-hover:scale-110 transition-transform mb-4">
                                                <FileUp className="w-8 h-8 text-emerald-600" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase text-gray-500 px-6 text-center">
                                                {data.file_materi ? data.file_materi.name : "Klik untuk Pilih PDF / Gambar"}
                                            </span>
                                            <input id="file_materi" name="file_materi" type="file" className="hidden" onChange={(e) => setData('file_materi', e.target.files?.[0] || null)} />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-7 bg-white p-10 rounded-[50px] shadow-sm border border-gray-100 flex flex-col relative min-h-[550px]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                    <Eye size={18} />
                                </div>
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Pratinjau</span>
                            </div>

                            <div className="flex-1 w-full rounded-[35px] overflow-hidden bg-gray-900 shadow-2xl relative border-[12px] border-gray-900">
                                {data.tipe_konten === 'link' && data.embed_code ? (
                                    <div className="w-full h-full animate-in zoom-in-95 duration-500" dangerouslySetInnerHTML={{ __html: convertYoutubeToEmbed(data.embed_code) }} />
                                ) : data.tipe_konten === 'file' && data.file_materi ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        {data.file_materi.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(data.file_materi)} className="max-w-full max-h-full object-contain p-4" />
                                        ) : (
                                            <iframe src={URL.createObjectURL(data.file_materi)} className="w-full h-full" title="Preview PDF" />
                                        )}
                                    </div>
                                ) : data.tipe_konten === 'file' && materi.file ? (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    {materi.file.endsWith('.pdf') ? (
                                      <iframe
                                        src={`/course/preview/${materi.id}`}
                                        className="w-full h-full"
                                        title="Preview PDF"
                                      />
                                    ) : (
                                      <img
                                        src={`/course/preview/${materi.id}`}
                                        className="max-w-full max-h-full object-contain p-4"
                                        alt="Preview"
                                      />
                                    )}
                                  </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
                                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
                                            <Globe className="text-gray-700" size={32} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Menunggu Input Media...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-end bg-white p-6 rounded-[35px] shadow-lg border border-emerald-50 gap-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full md:w-auto bg-blue-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <Save className="text-white-700" size={20} />
                            {processing ? "Menyimpan data..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}