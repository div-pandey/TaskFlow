"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import styles from "../login/login.module.css";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Auto login after registration
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (loginRes?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`card ${styles.authCard}`}>
        <h2>Create an Account</h2>
        <p className={styles.authSubtitle}>Join TaskFlow today</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              className="input-field" 
              required 
              placeholder="John Doe"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              className="input-field" 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              className="input-field" 
              required 
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
