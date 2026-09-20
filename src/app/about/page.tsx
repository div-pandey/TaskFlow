import styles from "../static.module.css";

export default function AboutPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>About TaskFlow</h1>
      <span className={styles.lastUpdated}>Our Story & Mission</span>
      
      <div className={styles.content}>
        <p>
          TaskFlow was born out of a simple frustration: project management tools are either too simple and lack features, or too complex and slow you down. We set out to build a platform that respects the flow state.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          We believe that software should be fast, elegant, and intuitive. Our mission is to provide developers, designers, and creators with a distraction-free environment to organize their thoughts, track progress, and build amazing things.
        </p>

        <h2>Crafted for Focus</h2>
        <p>
          Every feature in TaskFlow is designed with human ergonomics in mind. From our warm, earthy color palettes to our near real-time sync engine, we minimize cognitive load so you can focus on what matters most: doing the work.
        </p>
      </div>
    </div>
  );
}
