import { useForm, Link } from "@inertiajs/react"; 
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface User {
  name: string;
  email: string;
  jk: "L" | "P";
  role: string;
}

export default function EditProfil({ user, role }: { user: User, role: string }) {
  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    jk: user.jk,
  });

  const submit = (e: React.FormEvent) => {
      e.preventDefault();
      put('/update-profil'); 
      
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Edit Profil',
      href: '#',
    }
  ];
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
        <div className="w-full max-w-lg p-6 rounded shadow-lg bg-[#f4c892]">
          <h1 className="text-center font-semibold mb-2 text-gray-800">EDIT PROFIL</h1>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Nama</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[#0F828C] outline-none"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Jenis Kelamin</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="jk"
                    value="L"
                    checked={data.jk === "L"}
                    onChange={(e) => setData("jk", e.target.value as "L" | "P")}
                    className="accent-[#0F828C]"
                  />
                  <span>Laki-laki</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="jk"
                    value="P"
                    checked={data.jk === "P"}
                    onChange={(e) => setData("jk", e.target.value as "L" | "P")}
                    className="accent-[#0F828C]"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
              {errors.jk && <p className="text-red-500 text-sm mt-1">{errors.jk}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-[#0F828C] outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 bg-[#0F828C] hover:bg-[#0d6e77] text-white rounded transition-colors disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>

              <Link 
                href={`/${user.role}/dashboard`} 
                className="px-4 py-2 rounded bg-gray-300"
            >
                Batal
            </Link>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}