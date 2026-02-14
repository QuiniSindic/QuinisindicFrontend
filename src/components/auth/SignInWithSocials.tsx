'use client';

import { loginWithGoogle } from '@/actions/auth';
import AppleIcon from '../common/icons/AppleIcon';
import GoogleIcon from '../common/icons/GoogleIcon';

interface SignInWithSocialsProps {
  isLogin?: boolean;
}

const baseButtonClasses =
  'flex items-center justify-center gap-4 px-6 py-3 rounded-lg border border-border ' +
  'bg-surface text-text shadow-sm transition-colors cursor-pointer ' +
  'hover:bg-background focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const SignInWithSocials = ({ isLogin }: SignInWithSocialsProps) => {
  const googleLabel = isLogin
    ? 'Iniciar sesión con Google'
    : 'Registrarse con Google';

  const appleLabel = isLogin
    ? 'Iniciar sesión con Apple'
    : 'Registrarse con Apple';

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="flex flex-col space-y-4 justify-center">
      <button
        type="button"
        onClick={() => handleGoogleLogin()}
        className={baseButtonClasses}
      >
        <GoogleIcon className="h-6 w-6 shrink-0" />
        <span>{googleLabel}</span>
      </button>

      <button
        type="button"
        // onClick={handleAppleSubmit}
        className={baseButtonClasses}
      >
        <AppleIcon className="h-6 w-6 shrink-0 text-text" />
        <span>{appleLabel}</span>
      </button>
    </div>
  );
};

export default SignInWithSocials;
