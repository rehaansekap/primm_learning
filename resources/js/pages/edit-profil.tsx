import { useForm, Link } from "@inertiajs/react"; 
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { User, Mail, Save, XCircle, Camera } from 'lucide-react';

interface User {
  name: string;
  email: string;
  jk: "L" | "P";
  role: string;
}

export default function EditProfil({ user }: { user: User }) {
  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    jk: user.jk,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/update-profil'); 
  };

  const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit Profil', href: '#' }];
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="h-[calc(100vh-64px)] w-full flex items-start justify-center bg-gray-50 overflow-hidden p-6 pt-20">
        <div className="w-full max-w-md bg-white rounded-[28px] overflow-hidden shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">

          <div className="bg-[#009688] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <User size={20} className="text-white/80" />
              <div>
                <h1 className="text-lg font-black tracking-tight leading-none">Edit Profil</h1>
                <p className="text-[10px] text-white/70 font-medium">Perbarui data diri Anda</p>
              </div>
            </div>
            <Link href={`/${user.role}/dashboard`}>
              
            </Link>
          </div>

          <div className="p-6">
            <form onSubmit={submit} className="space-y-4">
              {/* Input Nama */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-teal-700 ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#009688] text-sm font-bold text-gray-700 shadow-sm"
                />
              </div>

              {/* Input Jenis Kelamin */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-teal-700 ml-1">Jenis Kelamin</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setData("jk", "L")}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${data.jk === "L" ? "bg-teal-50 border-[#009688] text-[#009688]" : "bg-white border-gray-100 text-gray-400"}`}
                  >
                    Laki-laki
                  </button>
                  <button
                    type="button"
                    onClick={() => setData("jk", "P")}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${data.jk === "P" ? "bg-teal-50 border-[#009688] text-[#009688]" : "bg-white border-gray-100 text-gray-400"}`}
                  >
                    Perempuan
                  </button>
                </div>
              </div>

              {/* Input Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-teal-700 ml-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#009688] text-sm font-bold text-gray-700 shadow-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-[#009688] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-100 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {processing ? '...' : 'Simpan'}
                </button>
                <Link 
                  href={`/${user.role}/dashboard`} 
                  className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center active:scale-95 transition-all"
                >
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}