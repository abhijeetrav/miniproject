// app/layout.tsx
export const metadata = {
  title: 'My App',
  description: 'Delivery Tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
