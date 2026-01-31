'use client';

import FormAuth from '@/components/auth/FormAuth';
import SignInWithSocials from '@/components/auth/SignInWithSocials';
import SignInWithSocialsDivider from '@/components/auth/SignWithSocialsDivider';

const LoginPage = () => {
  return (
    <div className="w-full space-y-4">
      <SignInWithSocials isLogin={true} />
      <SignInWithSocialsDivider />
      <FormAuth isLogin={true} />
    </div>
  );
};

export default LoginPage;
