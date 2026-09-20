"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${styles.navbar} glass-panel`}
    >
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image src="/icon.png" alt="TaskFlow" width={32} height={32} className={styles.logoImg} />
          <span className={styles.logoText}>TaskFlow</span>
        </Link>

        <div className={styles.links}>
          {status === "authenticated" ? (
            <div className={styles.avatarWrapper} ref={dropdownRef}>
              <button
                className={styles.avatarButton}
                onClick={() => setOpen((o) => !o)}
                aria-label="User menu"
              >
                <span className={styles.avatarInitials}>{initials}</span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    className={styles.dropdown}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <div className={styles.dropdownUser}>
                      <div className={styles.dropdownAvatar}>
                        <span>{initials}</span>
                      </div>
                      <div className={styles.dropdownUserInfo}>
                        <span className={styles.dropdownName}>{session.user?.name ?? "User"}</span>
                        <span className={styles.dropdownEmail}>{session.user?.email}</span>
                      </div>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <button
                      className={styles.signOutBtn}
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.link}>
                Sign In
              </Link>
              <Link href="/register" className="btn-secondary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
