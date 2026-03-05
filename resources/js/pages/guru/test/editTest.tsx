import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from "lucide-react"; 
import { Link } from '@inertiajs/react';
interface Props {
    test: {
        id: number;
        title: string;
        description: string;
        link: string;
    };
}

export default function editTest({ test }: Props) {
    

    const { data, setData, put, processing, errors } = useForm({
        title: test.title || '',
        description: test.description || '',
        link: test.link || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/guru/test/${test.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
      { title: 'Edit Test', href: '/guru/test/editTest' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-[50%] max-w-5xl mx-auto p-6  bg-[#f4c892] rounded-xl shadow-sm border mt-10">
                <h2 className="text-xl font-bold mb-6 text-center">Edit Data Test</h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Judul</label>
                        <input 
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                        {errors.title && <div className="text-red-500 text-xs">{errors.title}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Deskripsi</label>
                        <textarea 
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                        {errors.description && <div className="text-red-500 text-xs">{errors.description}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Link Test</label>
                        <input 
                            type="url"
                            value={data.link}
                            onChange={e => setData('link', e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                        {errors.link && <div className="text-red-500 text-xs">{errors.link}</div>}
                    </div>

                    <Link
                        href="/guru/test"
                        className="px-4 py-2 text-black bg-gray-400 hover:bg-gray-100 rounded-lg font-medium inline-block mr-3"
                    >
                        Batal
                    </Link>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {processing ? 'Menyimpan...' : 'Update Data'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}