import styles from "../static.module.css";

export default function PrivacyPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <span className={styles.lastUpdated}>Last updated: July 4, 2026</span>
      
      <div className={styles.content}>
        <p>
          At TaskFlow, we respect your privacy. This policy outlines how we handle your personal data when you use our task management application.
        </p>
        
        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Account Data:</strong> Name and email address required to create your account.</li>
          <li><strong>Task Content:</strong> Titles, status, and metadata of tasks you create.</li>
          <li><strong>Session Tokens:</strong> Secure tokens used to keep you signed in.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>
          We use your information solely to provide, secure, and improve the TaskFlow application. We do not sell your personal data or task details to third parties for advertising or any other purposes.
        </p>

        <h2>Data Protection</h2>
        <p>
          Your data is encrypted in transit and stored securely. Account passwords are encrypted using bcrypt hashing before saving to the database, ensuring your credentials remain private.
        </p>
      </div>
    </div>
  );
}
