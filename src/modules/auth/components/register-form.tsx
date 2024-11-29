'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LucideArrowRight, LucideCat, LucideEye, LucideEyeClosed, LucideLoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useRegisterForm } from '../hooks/use-register-form';

export function RegisterForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisible = () => setPasswordVisible((visible) => !visible);

  const register = useRegisterForm();

  return (
    <Form {...register.form}>
      <form
        onSubmit={register.handleSubmit}
        className="flex flex-col gap-3 border p-8 rounded-lg max-w-xl aspect-square w-full bg-background shadow-xl"
      >
        <h1 className="text-4xl mb-2 font-black">Criar conta</h1>

        <FormField
          control={register.form.control}
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
          control={register.form.control}
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

        {register.mutation.isError && (
          <p className="bg-destructive text-destructive-foreground rounded-lg px-4 py-3 my-3">
            {register.mutation.error.message}
          </p>
        )}

        {register.mutation.isSuccess && (
          <p className="bg-green-500 text-white flex items-center rounded px-4 py-3 my-3 font-semibold relative">
            <LucideCat className="inline-flex mr-2" />
            {register.mutation.data}
          </p>
        )}

        <Button type="submit" className="mt-auto font-semibold uppercase">
          {register.mutation.isPending ? 'Criando...' : 'Criar'}
          {register.mutation.isPending ? <LucideLoaderCircle className="animate-spin" /> : <LucideArrowRight />}
        </Button>
      </form>
    </Form>
  );
}
