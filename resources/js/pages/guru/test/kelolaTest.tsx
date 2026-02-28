import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core'

export interface PageProps extends InertiaPageProps {
  tests: Test[]
}

interface Test {
  id: number;
  title: string;
  description: string;
  link: string;
}

export default function KelolaTest() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Kelola Test',
      href: '/guru/test/kelola-test',
    },
  ];

const { tests = [] } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="w-full px-6 lg:px-10 py-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <h3 className="font-medium text-gray-800 mb-1">Silahkan Tambah Test!!!</h3>

              <Link
                href="/guru/test/form-tambah"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-green-700 px-4 py-2 text-sm font-medium text-white transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Test
              </Link>
            </div>
          </div>
        </div>

        {/* ===== CARD LIST DATA TEST ===== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Daftar Test
            </h2>
            <p className="text-sm text-gray-500">
              List test yang sudah dibuat
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-center font-medium">No</th>
                  <th className="px-4 py-3 text-left font-medium">Judul</th>
                  <th className="px-4 py-3 text-left font-medium">Deskripsi</th>
                  <th className="px-4 py-3 text-left font-medium">Link</th>
                  <th className="px-4 py-3 text-center font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {tests.length > 0 ? (
                  tests.map((test, index) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {test.title}
                      </td>
                      <td className="px-4 py-3">
                        {test.description}
                      </td>
                      <td className="px-4 py-3">
                        {test.link}
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <div className="flex items-center gap-2"> 
                          <Link
                            href={`/guru/test/${test.id}/edit`}
                            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-2 gap-1.5 rounded-lg transition-colors"
                          >
                            <Pencil size={14} />
                            Edit
                          </Link>
                          
                          <Link
                            href={`/guru/test/${test.id}`}
                            method="delete"
                            as="button"
                            onBefore={() => confirm('Apakah Anda yakin ingin menghapus data ini?')}
                            className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-4 py-2 gap-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                            Hapus
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-gray-500"
                    >
                      Belum ada test
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