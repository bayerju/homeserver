// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { SessionProvider } from "next-auth/react";

const MyApp: AppType<any> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      < Component {...pageProps} />
    </SessionProvider>

  );
};

export default trpc.withTRPC(MyApp);
