export default function OPDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        OPD Management
      </header>

      <main className="p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
