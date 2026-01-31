'use client';

import FormAuth from '@/components/auth/FormAuth';
import SignInWithSocials from '@/components/auth/SignInWithSocials';
import SignInWithSocialsDivider from '@/components/auth/SignWithSocialsDivider';

const SignUpPage = () => {
  return (
    <div className="w-full space-y-4">
      <SignInWithSocials isLogin={false} />
      <SignInWithSocialsDivider />
      <FormAuth isLogin={false} />
    </div>
  );
};

export default SignUpPage;
