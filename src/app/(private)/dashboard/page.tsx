import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { validateSession } from "@/modules/auth/lib/session-next";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await validateSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
      <SignOutButton />
    </div>
  );
}
