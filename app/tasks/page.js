"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

// Lucide icons
import {
  ClipboardList,
  PlusCircle,
  LogOut,
  PencilLine,
  Trash2,
} from "lucide-react";

export default function TasksPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setTasks(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch tasks.");
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return null;

  const handleDelete = async (taskId) => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (!res.ok) {
          throw new Error(data.message || "Failed to delete");
        }
        toast.success("Task deleted");
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
      } catch {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      toast.error(err.message || "Delete request failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              My Tasks
            </h1>
            <Link
              href="/tasks/new"
              className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Task
            </Link>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading your tasks...
          </p>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-lg">You have no tasks yet.</p>
            <p className="text-sm text-gray-400">Time to get productive! 🎯</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {task.title}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description || "No description provided."}
                    </p>
                    <div className="mt-3 flex gap-6 text-sm">
                      <Link
                        href={`/tasks/${task._id}/edit`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <PencilLine className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm self-start ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
