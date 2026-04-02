import { getSession, signOut, useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-12 text-black">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#d9d2bf] bg-white p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="rounded-3xl border border-[#C6A85B] bg-black p-8 text-white">
          <div className="text-[12px] uppercase tracking-[0.35em] text-[#C6A85B]">
            Smith-Heffa Paygate
          </div>
          <h1 className="mt-3 text-3xl font-semibold">Session active</h1>
          <p className="mt-3 text-white/75">
            {session?.user?.email || "Utilisateur connecté"}
          </p>
          <p className="mt-1 text-sm text-white/55">
            Provider: {session?.provider || "unknown"}
          </p>

          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="mt-6 rounded-2xl border border-[#C6A85B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#C6A85B]"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
