import { ReactNode } from 'react';
import './globals.css'
export const metadata = {
  title: 'Список дел',
  description: 'Совместное управление списком дел по ключевому слову',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
