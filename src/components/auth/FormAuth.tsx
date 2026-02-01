'use client';

import { login, signup } from '@/actions/auth';
import { AuthFormData } from '@/types/auth/auth.types';
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
  const [error, setError] = React.useState<string | undefined>();
  const [isPending, startTransition] = React.useTransition();

  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthFormData>({
    mode: 'onChange',
    defaultValues: { email: '', password: '', username: '' },
  });

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    setError(undefined);

    const { email, password, username } = data;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    if (!isLogin && username) {
      formData.append('username', username);
    }

    startTransition(async () => {
      const action = isLogin ? login : signup;

      try {
        const result = await action(formData);

        // Si hay error, lo mostramos. Si hay éxito, la acción redirige sola.
        if (result?.error) {
          setError(result.error);
        }

        await queryClient.invalidateQueries({ queryKey: ['user'] });
        router.push('/home');
        router.refresh();
      } catch (err) {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    });
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

      <SubmitButton isLoading={isPending} disabled={!isValid || isPending}>
        {isLogin ? 'Inicia sesión' : 'Registrarse'}
      </SubmitButton>

      <HasAccount isLogin={isLogin} />
    </form>
  );
};

export default FormAuth;
