import styles from "../static.module.css";

export default function TermsPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Terms & Conditions</h1>
      <span className={styles.lastUpdated}>Last updated: July 4, 2026</span>
      
      <div className={styles.content}>
        <p>
          Welcome to TaskFlow. By accessing or using our service, you agree to comply with and be bound by the following terms and conditions.
        </p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By creating an account or using TaskFlow, you represent that you are at least 13 years of age and agree to these terms. If you do not agree, please do not use the service.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          You are responsible for maintaining the security of your account and password. TaskFlow cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
        </p>

        <h2>3. Content & Responsibility</h2>
        <p>
          You retain all rights to any tasks, descriptions, or content you input into the platform. You agree not to upload harmful, offensive, or malicious code to the servers.
        </p>

        <h2>4. Modifications to Service</h2>
        <p>
          We reserve the right to modify or discontinue the service, temporarily or permanently, with or without notice at any time.
        </p>
      </div>
    </div>
  );
}
