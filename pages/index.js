import { getSession } from "next-auth/react";

export default function Home() {
  if (typeof window !== "undefined") {
    window.location.replace("/auth/login");
  }
  return null;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
}
