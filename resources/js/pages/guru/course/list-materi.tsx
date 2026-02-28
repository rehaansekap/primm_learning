import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FormTambahMateri from './form-tambah-materi'; 
import { Plus, FileText, CheckCircle2 } from "lucide-react"; 
import { Link, router, usePage } from '@inertiajs/react';

/* ===== TYPES ===== */
type Category = {
  id: number;
  name: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  category?: Category;
};

type PageProps = {
  categories: Category[];
  courses: Course[];
};

/* ===== BREADCRUMB ===== */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tambah dan List Materi', href: '/guru/course/list-materi' },
];

const ListMateri = () => {
  const { courses, categories } = usePage<PageProps>().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { flash } = usePage().props as any;
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  // Show success message when flash message appears
    useEffect(() => {
        if (flash?.success) {
            setShowSuccessMsg(true);
            const timer = setTimeout(() => setShowSuccessMsg(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

  const handleSimpanMateri = (
    title: string,
    category_id: string,
    description: string
  ) => {
    return {
      title,
      category_id,
      description,
    };
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        {/* Success Message */}
        {showSuccessMsg && (
            <div className="max-w-6xl mx-auto mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-[20px] flex items-center gap-3 shadow-md">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                    <span className="font-semibold text-[14px]">{flash?.success}</span>
                </div>
            </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-emerald-400 transition shadow-md"
          >
            <Plus size={16} className='inline-block' />
            Tambah Materi
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-gray-600">Judul</th>
                <th className="p-4 text-gray-600">Kategori</th>
                <th className="p-4 text-gray-600">Deskripsi</th>
                <th className="p-4 text-center text-gray-600">Aksi Detail</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400 italic">
                    Belum ada materi
                  </td>
                </tr>
              ) : (
                courses.map((materi) => (
                  <tr key={materi.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-800">
                      {materi.title}
                    </td>

                    <td className="p-4 font-semibold text-gray-800">
                      {materi.category?.name ?? '-'}
                    </td>

                    <td className="p-4 text-gray-600 text-sm">
                      {materi.description}
                    </td>

                    <td className="p-4 flex justify-center gap-2">
                      <Link 
                        href={`/guru/course/content-materi/${materi.id}?judul=${encodeURIComponent(materi.title)}&kategori=${encodeURIComponent(materi.category?.name || '')}&deskripsi=${encodeURIComponent(materi.description)}`}
                        className="group flex items-center gap-2 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-black text-[12px] uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                      >
                        <FileText size={16} />
                        Lengkapi Konten
                      </Link>

                      <Link 
                        href={`/guru/course/primm/list-primm/${materi.id}?judul=${encodeURIComponent(materi.title)}&kategori=${encodeURIComponent(materi.category?.name || '')}&deskripsi=${encodeURIComponent(materi.description)}`}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] px-3 py-1.5 rounded font-bold flex items-center gap-1 transition"
                      >
                        <Plus size={14} strokeWidth={3} />
                        Aktivitas PRIMM
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <FormTambahMateri 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          categories={categories}
          onSimpan={handleSimpanMateri}
        />

      </div>
    </AppLayout>
  );
};

export default ListMateri;