import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {

    return (
        <AuthLayout
            title="DAFTAR AKUN"
            description="Isi dengan benar ya!!!"
        >
            <Head title="Register" />
            <Form
                method='post'
                action="/register"
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                  <div className="grid gap-6">
                      <div className="grid gap-2">
                          <Label htmlFor="name">Nama Lengkap</Label>
                          <Input
                              id="name"
                              type="text"
                              required
                              autoFocus
                              autoComplete="name"
                              name="name"
                              placeholder="Full name"
                          />
                          <InputError
                              message={errors.name}
                              className="mt-2"
                          />
                      </div>

                      <div className="grid gap-2">
                          <Label htmlFor="jk">Jenis Kelamin</Label>
                          <div className="flex items-center gap-6">
                              <label className="flex items-center gap-2">
                                <input type="radio" name="jk" value="L" required className="h-4 w-4"/>Laki-laki
                              </label>

                              <label className="flex items-center gap-2">
                                <input type="radio" name="jk" value="P" className="h-4 w-4" /> Perempuan
                              </label>
                          </div>

                          <InputError message={errors.jk} className="mt-2" />
                      </div>


                      <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                              id="email"
                              type="email"
                              required
                              autoComplete="email"
                              name="email"
                              placeholder="email@example.com"
                          />
                          <InputError message={errors.email} />
                      </div>

                      <div className="grid gap-2">
                          <Label htmlFor="role">Peran</Label>
                          <select
                              id="role"
                              name="role"
                              required
                              className="border rounded-md p-2"
                          >
                              <option value="guru">Guru</option>
                              <option value="siswa">Siswa</option>
                          </select>

                          <InputError message={errors.role} className="mt-2" />
                      </div>

                      <div className="grid gap-2">
                          <Label htmlFor="password">Kata Sandi</Label>
                          <Input
                              id="password"
                              type="password"
                              required
                              autoComplete="new-password"
                              name="password"
                              placeholder="Password"
                          />
                          <InputError message={errors.password} />
                      </div>

                      <div className="grid gap-2">
                          <Label htmlFor="password_confirmation">
                              konfirmasi Kata Sandi
                          </Label>
                          <Input
                              id="password_confirmation"
                              type="password"
                              required
                              autoComplete="new-password"
                              name="password_confirmation"
                              placeholder="Confirm password"
                          />
                          <InputError
                              message={errors.password_confirmation}
                          />
                      </div>
                      <div className="button-container">
                        {processing && <Spinner />}
                      <Button
                          disabled={processing}
                          type="submit"
                          className="btnregis"
                          data-test="register-user-button"
                      >
                          Daftar
                      </Button>
                      </div>
                  </div>
                )}
            </Form>
        </AuthLayout>
    );
}
