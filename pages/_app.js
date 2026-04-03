import { SessionProvider } from "next-auth/react";
import EnterpriseFooter from "../components/layout/EnterpriseFooter";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <EnterpriseFooter />
    </SessionProvider>
  );
}
