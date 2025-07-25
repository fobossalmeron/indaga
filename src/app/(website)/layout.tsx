export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="text-foreground bg-background relative flex flex-col items-center pt-16">
      {children}
    </main>
  );
}
