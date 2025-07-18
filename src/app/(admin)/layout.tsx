export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="pt-26">{children}</main>;
}