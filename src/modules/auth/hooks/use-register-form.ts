import { Result, unwrap } from '@/lib/result';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { registerUserFormSchema, RegisterUserFormSchema } from '../validation/schema';

export function useRegisterForm() {
  const form = useForm<RegisterUserFormSchema>({
    resolver: zodResolver(registerUserFormSchema),
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: RegisterUserFormSchema) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const json: Result<string> = await res.json();

      return unwrap(json);
    },
    onSuccess: (data) => {
      toast(data, { dismissible: true });
      router.replace('/dashboard');
    },
  });

  const handleSubmit = form.handleSubmit((data) => mutation.mutateAsync(data));

  return { form, handleSubmit, mutation };
}
