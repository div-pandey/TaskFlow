"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { getTasks, createTask, updateTaskStatus, deleteTask } from "@/app/actions/tasks";
import { Plus, Trash2, Clock, CheckCircle2, Circle } from "lucide-react";
import styles from "./dashboard.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Custom fetcher for Server Actions
const fetcher = async () => {
  const tasks = await getTasks();
  return tasks;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Real-time polling every 3 seconds using SWR
  const { data: tasks, error, mutate, isLoading } = useSWR("tasks", fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "unauthenticated" || status === "loading") {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  if (error) {
    return <div className={styles.error}>Failed to load tasks.</div>;
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await createTask(newTaskTitle);
      setNewTaskTitle("");
      mutate(); // Optimistic/immediate re-fetch
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "TODO" ? "IN_PROGRESS" : currentStatus === "IN_PROGRESS" ? "DONE" : "TODO";
    try {
      // Optimistic update can be applied here with mutate(..., false)
      await updateTaskStatus(id, newStatus);
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE": return <CheckCircle2 className={styles.statusDone} />;
      case "IN_PROGRESS": return <Clock className={styles.statusProgress} />;
      default: return <Circle className={styles.statusTodo} />;
    }
  };

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Tasks</h1>
          <p className={styles.subtitle}>Welcome back, {session?.user?.name || "User"}!</p>
        </div>
      </header>

      <form onSubmit={handleCreateTask} className={styles.createTaskForm}>
        <input 
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={`input-field ${styles.taskInput}`}
          disabled={isSubmitting}
        />
        <button type="submit" className="btn-primary" disabled={isSubmitting || !newTaskTitle.trim()}>
          <Plus size={20} /> Add Task
        </button>
      </form>

      <div className={styles.taskList}>
        {tasks?.length === 0 ? (
          <div className={styles.emptyState}>No tasks found. Create one above!</div>
        ) : (
          tasks?.map((task) => (
            <div key={task.id} className={`card ${styles.taskCard} ${task.status === "DONE" ? styles.taskCardDone : ""}`}>
              <button 
                onClick={() => handleStatusToggle(task.id, task.status)}
                className={styles.statusButton}
                title={`Mark as ${task.status === "TODO" ? "In Progress" : task.status === "IN_PROGRESS" ? "Done" : "Todo"}`}
              >
                {getStatusIcon(task.status)}
              </button>
              
              <div className={styles.taskContent}>
                <h3 className={task.status === "DONE" ? styles.textDone : ""}>{task.title}</h3>
                <span className={styles.taskDate}>
                  {new Date(task.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              <button 
                onClick={() => handleDelete(task.id)}
                className={styles.deleteButton}
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
