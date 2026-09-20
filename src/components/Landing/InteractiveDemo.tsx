"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import styles from "./Landing.module.css";

const initialTasks = [
  { id: 1, title: "Design new landing page", status: "DONE" },
  { id: 2, title: "Integrate Framer Motion", status: "IN_PROGRESS" },
  { id: 3, title: "Launch on ProductHunt", status: "TODO" },
];

export default function InteractiveDemo() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-animate task statuses to simulate real-time collaboration
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(current => {
        const next = [...current];
        const task = { ...next[1] }; // Always animate the middle one
        if (task.status === "IN_PROGRESS") task.status = "DONE";
        else if (task.status === "DONE") task.status = "TODO";
        else task.status = "IN_PROGRESS";
        next[1] = task;
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.demoSection}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring" }}
        className={`glass-panel ${styles.demoContainer}`}
      >
        <div className={styles.demoHeader}>
          <div className={styles.demoDots}>
            <span></span><span></span><span></span>
          </div>
          <div className={styles.demoTitle}>Real-time Mockup</div>
        </div>
        
        <div className={styles.demoBody}>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`${styles.demoTask} ${task.status === 'DONE' ? styles.demoTaskDone : ''}`}
              >
                {task.status === "DONE" ? <CheckCircle2 className={styles.demoIconDone} size={20} /> :
                 task.status === "IN_PROGRESS" ? <Clock className={styles.demoIconProgress} size={20} /> :
                 <Circle className={styles.demoIconTodo} size={20} />}
                
                <span className={styles.demoTaskTitle}>{task.title}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
