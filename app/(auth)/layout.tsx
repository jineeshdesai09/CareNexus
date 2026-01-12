export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {children}
    </div>
  );
}
