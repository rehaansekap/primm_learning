import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface StudentSummary {
    user_id: number;
    materi_selesai: number;
    user_name: string;
    total_fase: string; 
    rata_rata_nilai: number;
}

interface Props {
    students: StudentSummary[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Daftar Progress Nilai Siswa', href: '/guru/nilai' },
];

export default function DaftarNilai({ students }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <div className="p-8 bg-gray-50 min-h-screen">
            <Head title="Daftar Nilai Siswa" />
            <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-6">Daftar Progres Siswa</h1>
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                            <th className="p-4 border">Nama Siswa</th>
                            <th className="p-4 border">Materi Selesai</th>
                            <th className="p-4 border text-center">Fase Selesai</th>
                            <th className="p-4 border text-center">Rata-rata Nilai</th>
                            <th className="p-4 border text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.user_id} className="hover:bg-gray-50">
                                <td className="p-4 border font-medium">{student.user_name}</td>
                                <td className="p-4 border text-center">{student.materi_selesai}</td>
                                <td className="p-4 border text-center">{student.total_fase}</td>
                                <td className="p-4 border text-center">{student.rata_rata_nilai ?? '-'}</td>
                                <td className="p-4 border text-center">
                                    <Link 
                                        href={`/guru/nilai/detail/${student.user_id}`}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-bold"
                                    >
                                        Lihat & Nilai
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </AppLayout>
    );
}