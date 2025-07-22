"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then(setTasks);
    }
  }, [user]);

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </main>
  );
}
