import { FormData } from '@/types/auth/auth.types';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import PasswordField from '../ui/inputs/PasswordField';
import TextField from '../ui/inputs/TextField';

interface CredentialsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isLogin: boolean;
}

export const Credentials = ({
  register,
  errors,
  isLogin,
}: CredentialsProps) => {
  return (
    <div className="space-y-4">
      <TextField
        label="Correo electrónico"
        type="email"
        placeholder="email@email.com"
        {...register('email', {
          required: 'El correo es obligatorio',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Correo inválido',
          },
        })}
        errorText={errors.email?.message}
        autoComplete="email"
        inputMode="email"
        enterKeyHint="next"
      />

      <PasswordField
        label="Contraseña"
        placeholder="Contraseña"
        {...register('password', {
          required: 'La contraseña es obligatoria',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        })}
        errorText={errors.password?.message}
        autoComplete={isLogin ? 'current-password' : 'new-password'}
      />
    </div>
  );
};
