import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timezone Converter Tool",
  description: "A timezone converter tool",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
