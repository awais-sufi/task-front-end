"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2,
  FilePenLine,
  CalendarDays,
  ClipboardEdit,
  ChevronLeft,
  CircleCheck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    priority: "medium",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !id) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch task");

        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate?.split("T")[0] || "",
          status: data.status || "pending",
          priority: data.priority || "medium",
        });
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update task");

      router.push("/tasks");
    } catch (err) {
      alert(err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardEdit className="text-blue-600" size={28} />
            Edit Task
          </h1>
          <Link
            href="/tasks"
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Back to Tasks
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 flex items-center gap-2 animate-pulse">
            <Loader2 className="animate-spin" size={18} /> Loading task...
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FilePenLine size={16} />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FilePenLine size={16} />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <CalendarDays size={16} />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <CircleCheck size={18} />
              Update Task
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
