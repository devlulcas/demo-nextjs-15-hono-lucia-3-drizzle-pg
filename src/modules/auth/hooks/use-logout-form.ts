import { Result, unwrap } from '@/lib/result';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogoutForm() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const json: Result<string> = await res.json();

      return unwrap(json);
    },
    onSuccess: (data) => {
      toast(data, { dismissible: true });
      router.replace('/login');
    },
  });

  return { mutation };
}
