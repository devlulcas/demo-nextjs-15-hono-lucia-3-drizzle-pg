import { RegisterForm } from '@/modules/auth/components/register-form';
import Image from 'next/image';
import bgRegister from './sky.jpg';

export default function Page() {
  return (
    <div className="h-dvh w-dvw">
      <Image className="fixed inset-0 z-0" src={bgRegister} alt="background light" />
      <div className="grid place-items-center h-full w-full z-10 fixed inset-0 bg-violet-600/30 backdrop-blur-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
