"use client";

import { motion } from "framer-motion";
import { Layout, Zap, Layers, Lock } from "lucide-react";
import styles from "./Landing.module.css";

const features = [
  {
    title: "Real-Time Sync Engine",
    description: "Every keystroke, every status change is instantly reflected across all your devices with sub-millisecond latency.",
    icon: <Zap size={22} />,
    colSpan: 2,
    rowSpan: 1,
    gradient: "rgba(99,102,241,0.15)",
  },
  {
    title: "Bank-Grade Security",
    description: "Your data is encrypted at rest and in transit. Total privacy.",
    icon: <Lock size={24} />,
    colSpan: 1,
    rowSpan: 1,
    gradient: "rgba(16,185,129,0.15)",
  },
  {
    title: "Adaptive Layouts",
    description: "Whether on a 4K monitor or a smartphone, the UI adapts flawlessly.",
    icon: <Layout size={22} />,
    colSpan: 1,
    rowSpan: 2,
    gradient: "rgba(245,158,11,0.15)",
  },
  {
    title: "Infinite Nesting",
    description: "Break down complex projects into sub-tasks infinitely.",
    icon: <Layers size={22} />,
    colSpan: 2,
    rowSpan: 1,
    gradient: "rgba(139,92,246,0.15)",
  }
];

export default function FeatureBentoGrid() {
  return (
    <section className={styles.bentoSection}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={styles.bentoHeader}
      >
        <h2 className={styles.sectionTitle}>Everything you need.<br/>Nothing you don't.</h2>
      </motion.div>

      <div className={styles.bentoGrid}>
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={styles.bentoCard}
            style={{
              gridColumn: `span ${feature.colSpan}`,
              gridRow: `span ${feature.rowSpan}`
            }}
          >
            <div className={styles.bentoIconWrapper}>{feature.icon}</div>
            <h3 className={styles.bentoTitle}>{feature.title}</h3>
            <p className={styles.bentoDesc}>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
