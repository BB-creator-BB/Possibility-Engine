import type { Metadata } from 'next';
import '@xyflow/react/dist/style.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Possibility Engine',
  description:
    'A browser-based interactive thinking system for exploring speculative futures, radical technological shifts, and post-singularity scenarios through first-principles systems reasoning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="h-screen w-screen overflow-hidden bg-[#09090b] font-sans text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
