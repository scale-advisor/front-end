import './globals.css';
import AuthGuard from '@/components/AuthGuard';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <title>Scale Advisor</title>
        <meta name="description" content="Scale Advisor Application" />
      </head>
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
