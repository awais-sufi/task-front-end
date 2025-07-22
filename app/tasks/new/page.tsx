"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import {
  ClipboardPlus,
  FileText,
  Upload,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CreateTaskPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    attachment: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "attachment") {
      setForm((prev) => ({ ...prev, attachment: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("status", form.status);
    if (form.attachment) {
      formData.append("attachment", form.attachment);
    }

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Failed to create task");
      } else {
        router.push("/tasks");
      }
    } catch (err) {
      alert("Network error: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
            <ClipboardPlus className="text-blue-600" />
            Create Task
          </h1>
          <Link
            href="/tasks"
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Back to Tasks
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <FileText size={16} />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Optional notes..."
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
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Upload size={16} />
              Attachment
            </label>
            <input
              type="file"
              name="attachment"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-100 file:text-blue-700
                         hover:file:bg-blue-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 size={18} />
            Create Task
          </button>
        </form>
      </motion.div>
    </div>
  );
}
