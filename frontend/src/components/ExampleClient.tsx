"use client";

import { useState, useEffect } from "react";
import { Example } from "@prisma/client";

interface ExampleClientProps {
  initialData: Example[];
}

export default function ExampleClient({ initialData }: ExampleClientProps) {
  const [examples, setExamples] = useState<Example[]>(initialData);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // You can still fetch periodically on the client if needed,
  // but initialData is provided by the Server Component.
  const fetchExamples = async () => {
    try {
      const res = await fetch("/api/example");
      if (res.ok) {
        const data = await res.json();
        setExamples(data);
      }
    } catch (error) {
      console.error("Error fetching examples:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        setMessage("");
        // Re-fetch or optimistically update state
        fetchExamples();
      }
    } catch (error) {
      console.error("Error creating example:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-100 max-w-2xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-4">Client Component Interactive Area</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a new message..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-gray-700">Messages:</h3>
        {examples.length === 0 ? (
          <p className="text-gray-500 italic">No examples found. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {examples.map((ex) => (
              <li key={ex.id} className="p-3 bg-gray-50 rounded border flex justify-between items-center">
                <span>{ex.message}</span>
                <span className="text-xs text-gray-400">
                  {new Date(ex.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
