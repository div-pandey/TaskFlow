"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import styles from "./Landing.module.css";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <motion.div
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <motion.h1 variants={itemVariants} className={styles.title}>
          Orchestrate your work with <br />
          <span className="text-gradient-accent">unmatched precision.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className={styles.subtitle}>
          The ultra-premium task management platform designed for speed, 
          focus, and seamless real-time collaboration. Experience the flow state.
        </motion.p>

        <motion.div variants={itemVariants} className={styles.ctaGroup}>
          <Link href="/register" className={`btn-primary ${styles.heroBtn}`}>
            Start building for free <ArrowRight size={18} />
          </Link>
          <div className={styles.trustBadges}>
            <span className={styles.trustItem}><Zap size={14}/> Lightning Fast</span>
            <span className={styles.trustItem}><Shield size={14}/> Enterprise Grade</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Background glow effects */}
      <div className={styles.glowOrbTop}></div>
      <div className={styles.glowOrbBottom}></div>
    </section>
  );
}
