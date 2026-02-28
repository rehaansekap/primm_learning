import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Trash2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  jk: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Pagination {
  data: User[];
  current_page: number;
  per_page: number;
  links: PaginationLink[];
}

interface DataUserProps extends Record<string, any> {
  users: Pagination;
  filters: {
    search?: string;
  };
}

export default function DataUser() {
  const { users, filters } = usePage<DataUserProps>().props;

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    router.get(
      '/guru/list-siswa',
      { search: e.target.value },
      {
        preserveState: true,
        replace: true,
      }
    );
  }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List Siswa',
        href: '/guru/list-siswa',
    }
];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="w-full px-6 lg:px-10 py-6">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <input
              type="text"
              defaultValue={filters.search || ''}
              onChange={handleSearch}
              placeholder="Cari nama / email..."
              className="
                w-full sm:w-72
                rounded-lg border border-gray-300
                bg-white
                px-4 py-2 text-sm
                text-gray-800
                placeholder-gray-400
                focus:border-blue-500
                focus:ring-1 focus:ring-blue-500
              "
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-center font-medium">No</th>
                  <th className="px-4 py-3 text-left font-medium">Nama</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Jenis Kelamin
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users.data.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-center">
                      {(users.current_page - 1) *
                        users.per_page +
                        index +
                        1}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {user.name}
                    </td>

                    <td className="px-4 py-3">
                      {user.jk}
                    </td>

                    <td className="px-4 py-3">
                      {user.email}
                    </td>

                    <td className="px-4 py-3 text-center space-x-2">
                    
                    <button className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition">
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </td>
                  </tr>
                ))}

                {users.data.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-gray-500"
                    >
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AppLayout>

  );
}