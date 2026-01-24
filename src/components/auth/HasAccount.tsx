import Link from 'next/link';

interface HasAccountProps {
  isLogin?: boolean;
}

const HasAccount = ({ isLogin }: HasAccountProps) => {
  return (
    <p className="text-center text-sm text-muted">
      {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
      <Link
        href={isLogin ? '/sign-up' : '/login'}
        className="
          font-medium text-brand transition-colors duration-200
          hover:opacity-90
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
          rounded
        "
      >
        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
      </Link>
    </p>
  );
};

export default HasAccount;
