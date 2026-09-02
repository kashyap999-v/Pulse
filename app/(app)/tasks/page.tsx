"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
}

export default function TasksPage() {
  const router = useRouter();
  const { session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `/api/tasks?businessId=${session.business?.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setTasks(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [session]);

  const priorityColors: Record<string, string> = {
    HIGH: "bg-danger/10 text-danger",
    MEDIUM: "bg-warning/10 text-warning",
    LOW: "bg-success/10 text-success",
  };

  const statusColors: Record<string, string> = {
    TODO: "bg-neutral/10 text-neutral",
    IN_PROGRESS: "bg-primary/10 text-primary",
    DONE: "bg-success/10 text-success",
  };

  if (loading) {
    return <div className="p-8 animate-pulse">Loading tasks...</div>;
  }

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button
          onClick={() => router.push("/tasks/new")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-bg-primary border border-border rounded-lg p-12 text-center">
          <p className="text-text-secondary mb-4">No tasks yet</p>
          <button
            onClick={() => router.push("/tasks/new")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          >
            Create First Task
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* To Do */}
          <div className="bg-bg-primary border border-border rounded-lg p-4">
            <h3 className="font-bold mb-4">
              To Do ({todoTasks.length})
            </h3>
            <div className="space-y-2">
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-bg-secondary rounded border border-border hover:border-primary/20 transition"
                >
                  <p className="font-medium text-sm">{task.title}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        priorityColors[task.priority] || priorityColors["MEDIUM"]
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-text-secondary">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-bg-primary border border-border rounded-lg p-4">
            <h3 className="font-bold mb-4">
              In Progress ({inProgressTasks.length})
            </h3>
            <div className="space-y-2">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-primary/5 rounded border border-primary/20"
                >
                  <p className="font-medium text-sm">{task.title}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        priorityColors[task.priority] || priorityColors["MEDIUM"]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Done */}
          <div className="bg-bg-primary border border-border rounded-lg p-4">
            <h3 className="font-bold mb-4">
              Done ({doneTasks.length})
            </h3>
            <div className="space-y-2">
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-success/5 rounded border border-success/20 line-through text-text-secondary"
                >
                  <p className="font-medium text-sm">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
