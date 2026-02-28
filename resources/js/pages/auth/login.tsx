import { Form, Head, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import AuthLayoutLogin from '@/layouts/auth-layout-login';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

import '../../css/login.css';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  canRegister: boolean;
}

interface FlashProps {
  success?: string;
  error?: string;
}

export default function Login({
  status,
  canResetPassword,
}: Readonly<LoginProps>) {
  const { flash } = usePage().props as Readonly<{
    flash?: FlashProps;
  }>;

  return (
    <AuthLayoutLogin
      title="MASUK"
      description="Login dengan benar ya!!!"
    >
      <Head title="Masuk" />

      {flash?.success && (
        <Alert className="mb-6">
          <CheckCircle />
          <AlertTitle>Berhasil</AlertTitle>
          <AlertDescription>
            {flash.success}
          </AlertDescription>
        </Alert>
      )}

      <Form
        {...store.form()}
        resetOnSuccess={['password']}
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="email@example.com"
              />
              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              {/* <div className="flex items-center">
                <Label htmlFor="password">Kata Sandi</Label>

                {canResetPassword && (
                  <TextLink
                    href={request()}
                    className="ml-auto text-sm"
                  >
                    Lupa Kata Sandi?
                  </TextLink>
                )}
              </div> */}

              <Input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Password"
                className="
                  bg-white
                  text-gray-900
                  placeholder-gray-400
                "
              />
              <InputError message={errors.password} />
            </div>

            <div className="button-container">
              <Button
                type="submit"
                className="btnlogin"
                disabled={processing}
                data-test="login-button"
              >
                {processing && <Spinner />}
                Masuk
              </Button>
            </div>
          </div>
        )}
      </Form>

      {status && (
        <div className="mt-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}
    </AuthLayoutLogin>
  );
}