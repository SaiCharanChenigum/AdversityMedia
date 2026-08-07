import prisma from "@/lib/db";
import ExampleClient from "@/components/ExampleClient";

// This is a Server Component, so it runs entirely on the server
export default async function ExamplePage() {
  // Directly fetch data from the database securely on the server
  // No need for a fetch() call to our own API route!
  const initialExamples = await prisma.example.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-blue-900">
          Next.js 14 App Router + Prisma Setup
        </h1>
        
        <div className="prose prose-blue mb-8">
          <p className="text-lg">
            This page is a <strong>Server Component</strong>. The data you see below
            was fetched securely on the server by directly importing the Prisma client
            (<code>src/lib/db.ts</code>).
          </p>
          <p className="text-sm text-gray-600">
            Total records fetched on server: <strong>{initialExamples.length}</strong>
          </p>
        </div>

        {/* Pass the server-fetched data to the client component as initial state */}
        <ExampleClient initialData={initialExamples} />
      </div>
    </main>
  );
}
