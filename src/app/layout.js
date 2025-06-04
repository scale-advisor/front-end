import './globals.css';
import AuthGuard from '@/components/AuthGuard';
import { Suspense } from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <title>Scale Advisor</title>
        <meta name="description" content="Scale Advisor Application" />
      </head>
      <body>
        <Suspense fallback={null}>
          <AuthGuard>{children}</AuthGuard>
        </Suspense>
      </body>
    </html>
  );
}
