'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LucideArrowRight, LucideCat, LucideEye, LucideEyeClosed, LucideLoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useLoginForm } from '../hooks/use-login-form';

export function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisible = () => setPasswordVisible((visible) => !visible);

  const login = useLoginForm();

  return (
    <Form {...login.form}>
      <form
        onSubmit={login.handleSubmit}
        className="flex flex-col gap-3 border p-8 rounded-lg max-w-xl aspect-square w-full bg-background shadow-xl"
      >
        <h1 className="text-4xl mb-2 font-black">Entrar na sua conta</h1>

        <FormField
          control={login.form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="exemplo@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={login.form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <Input placeholder="*******" type={passwordVisible ? 'text' : 'password'} {...field} />
                  <Button
                    size="icon"
                    onClick={togglePasswordVisible}
                    title={passwordVisible ? 'Senha visível' : 'Senha oculta'}
                  >
                    {passwordVisible ? <LucideEye /> : <LucideEyeClosed />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {login.mutation.isError && (
          <p className="bg-destructive text-destructive-foreground rounded-lg px-4 py-3 my-3">
            {login.mutation.error.message}
          </p>
        )}

        {login.mutation.isSuccess && (
          <p className="bg-green-500 text-white flex items-center rounded px-4 py-3 my-3 font-semibold relative">
            <LucideCat className="inline-flex mr-2" />
            {login.mutation.data}
          </p>
        )}

        <Button type="submit" className="mt-auto font-semibold uppercase">
          {login.mutation.isPending ? 'Entrando...' : 'Entrar'}
          {login.mutation.isPending ? <LucideLoaderCircle className="animate-spin" /> : <LucideArrowRight />}
        </Button>
      </form>
    </Form>
  );
}
