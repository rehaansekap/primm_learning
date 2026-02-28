import React from 'react';
import { Form } from '@inertiajs/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: {
    id: number;
    name: string;
  }[],
  onSimpan: (
    title: string,
    category_id: string,
    description: string
  ) => void;
}

const FormTambahMateri: React.FC<Props> = ({ isOpen, onClose, categories }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            Tambah Materi Baru
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* FORM INERTIA */}
        <Form
          method="post"
          action="/guru/course/tambah-materi"
          onSuccess={onClose}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Judul Materi
            </label>
            <input
              required
              name="title"
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: for"
            />
          </div>

          <select
            required
            name="category_id"
            className="w-full border rounded-lg px-3 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Pilih Kategori --</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              name="description"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Jelaskan singkat isi materi ini..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400  hover:bg-gray-100 rounded-lg font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg transition-all"
            >
              Simpan
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FormTambahMateri;