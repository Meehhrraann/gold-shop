"use client";

import { seedDatabase } from "@/lib/actions/seed.action"; // Import the action
import { useState } from "react";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSeed = async () => {
    setLoading(true);
    setMsg("Seeding...");
    const result = await seedDatabase();
    setLoading(false);
    if (result.success) {
      setMsg("✅ " + result.message);
    } else {
      setMsg("❌ Error: " + result.error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-2xl font-bold">Database Seeder</h1>
      <p>Click below to generate 70 fake Products, Orders, and Comments.</p>

      <button
        onClick={handleSeed}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Generating Data..." : "Generate Fake Data"}
      </button>

      {msg && <p className="mt-4 font-mono text-lg">{msg}</p>}
    </div>
  );
}
