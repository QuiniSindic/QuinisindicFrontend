'use client';

import { login, signup } from '@/services/auth.service';
import { FormData } from '@/types/auth/auth.types';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SubmitButton from '../ui/buttons/AuthSubmitButton';
import AuthErrorText from '../ui/errors/AuthErrorText';
import TextField from '../ui/inputs/TextField';
import { Credentials } from './Credentials';
import HasAccount from './HasAccount';

interface FormAuthProps {
  isLogin?: boolean;
}

const FormAuth = ({ isLogin = false }: FormAuthProps) => {
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { email: '', password: '', username: '' },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError(undefined);
    setLoading(true);

    const { email, password, username } = data;

    try {
      if (isLogin) {
        const res = await login({ email, password });

        if (!res.ok) {
          setError(res.error);
          return;
        }

        const user = res.data;

        queryClient.setQueryData(['user'], user ?? null);
      } else {
        const res = await signup({ email, password, username: username ?? '' });
        if (!res.ok) {
          setError(res.error);
          return;
        }
        const user = res.data;

        queryClient.setQueryData(['user'], user ?? null);
      }
      router.push('/');
    } catch (err) {
      setError('Error de red. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {!isLogin && (
        <TextField
          label="Nombre de usuario"
          placeholder="Username"
          {...register('username', {
            required: 'El nombre de usuario es obligatorio',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
          })}
          errorText={errors.username?.message}
          autoComplete="username"
          enterKeyHint="next"
        />
      )}

      <Credentials register={register} errors={errors} isLogin={isLogin} />

      <AuthErrorText message={error} />

      <SubmitButton isLoading={loading} disabled={!isValid || loading}>
        {isLogin ? 'Inicia sesión' : 'Registrarse'}
      </SubmitButton>

      <HasAccount isLogin={isLogin} />
    </form>
  );
};

export default FormAuth;
