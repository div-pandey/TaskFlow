import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.logo}>
            <Image src="/icon.png" alt="TaskFlow" width={28} height={28} className={styles.logoImg} />
            <span className={styles.logoText}>TaskFlow</span>
          </Link>
          <p className={styles.brandDesc}>
            A premium, human-designed task management application built for focus and clarity.
          </p>
        </div>

        <div className={styles.linksColumns}>
          <div className={styles.column}>
            <h4>Product</h4>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
          </div>
          <div className={styles.column}>
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
      
      <div className={`container ${styles.bottomBar}`}>
        <p>&copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</p>
        <div className={styles.socials}>
          <a href="https://www.linkedin.com/in/div-kumar-cse/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/kumar-div/" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
