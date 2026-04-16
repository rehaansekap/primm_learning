import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: number; name: string; }[];
  course: any; 
}

const FormEditMateri: React.FC<Props> = ({ isOpen, onClose, categories, course }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    category_id: '',
    description: '',
    link_drive: '',
  });

  useEffect(() => {
    if (course) {
      setData({
        title: course.title || '',
        category_id: course.category_id || course.category?.id || '',
        description: course.description || '',
        link_drive: course.link_drive || '',
      });
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/guru/course/update/${course.id}`, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Edit Materi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Materi</label>
            <input 
              required
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
            <select 
              required
              value={data.category_id}
              onChange={e => setData('category_id', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
            <textarea 
              required
              rows={3}
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 text-blue-600">Link Google Drive (PDF)</label>
            <input 
              type="url"
              value={data.link_drive}
              onChange={e => setData('link_drive', e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 text-black focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-medium">Batal</button>
            <button 
              type="submit" 
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditMateri;