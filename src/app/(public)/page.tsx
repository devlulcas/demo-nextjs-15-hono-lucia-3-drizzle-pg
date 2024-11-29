import Link from "next/link";

export default async function Page() {
  return (
    <main>
      <h1>
        Demo NEXT JS + HONO + LUCIA + DRIZZLE + PG
      </h1>

      <div className="flex flex-col gap-2">
        <Link href='/login'>
          Entrar
        </Link>

        <Link href='/register'>
          Cadastro
        </Link>

        <Link href='/dashboard'>
          Dashboard
        </Link>
      </div>
    </main>
  );
}
