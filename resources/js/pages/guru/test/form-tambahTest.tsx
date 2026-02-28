import { Form, useForm, Link} from '@inertiajs/react';
import { Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function TambahTest() {
  const { data, setData, post, processing } = useForm({
    title: '',
    description: '',
    link: '',
  });

  return (
    <AppLayout>
      <div className="w-full px-6 lg:px-10 py-6">
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Tambah Test
            </h2>
            <p className="text-sm text-gray-500">
              Lengkapi informasi test dengan benar
            </p>
          </div>

          <Form
            method="post"
            action="/guru/test"
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              post('/guru/test');
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Test
                </label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Masukkan judul test"
                  className="
                    w-full rounded-lg border border-gray-300
                    px-4 py-2 text-sm text-gray-800
                    placeholder-gray-400
                    focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Test
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Masukkan deskripsi test"
                  className="
                    w-full rounded-lg border border-gray-300
                    px-4 py-2 text-sm text-gray-800
                    placeholder-gray-400
                    focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Test
                </label>
                <input
                  type="url"
                  name="link"
                  value={data.link}
                  onChange={(e) => setData('link', e.target.value)}
                  placeholder="https://contoh.com/test"
                  className="
                    w-full rounded-lg border border-gray-300
                    px-4 py-2 text-sm text-gray-800
                    placeholder-gray-400
                    focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500
                  "
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Link
                href="/guru/test"
                as="button"
                type="button"
                className="px-4 py-2 text-black bg-gray-400 hover:bg-gray-100 rounded-lg font-medium mr-3"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Save className="w-4 h-4 inline mr-1" />
                Simpan
              </button>
            </div>
          </Form>

        </div>
      </div>
    </AppLayout>
  );
}