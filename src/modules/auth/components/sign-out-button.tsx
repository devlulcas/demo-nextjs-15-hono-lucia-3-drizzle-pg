'use client';

import { Button } from '@/components/ui/button';
import { LogOut, LucideLoaderCircle } from 'lucide-react';
import { useLogoutForm } from '../hooks/use-logout-form';

export function SignOutButton() {
  const logout = useLogoutForm();

  return (
    <Button onClick={() => logout.mutation.mutate()}>
      {logout.mutation.isPending ? <LucideLoaderCircle className="animate-spin" /> : <LogOut />}
      {logout.mutation.isPending ? 'Saindo' : 'Sair'} da conta
    </Button>
  );
}
