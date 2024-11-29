import { LoginForm } from '@/modules/auth/components/login-form';
import Image from 'next/image';
import bgLogin from './sky.jpg';

export default function Page() {
  return (
    <div className="h-dvh w-dvw">
      <Image className="fixed inset-0 z-0" src={bgLogin} alt="background light" />
      <div className="grid place-items-center h-full w-full z-10 fixed inset-0 bg-purple-600/30 backdrop-blur-sm">
        <LoginForm />
      </div>
    </div>
  );
}
