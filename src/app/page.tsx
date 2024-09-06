import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={`${styles.main} bg-offwhite`}>
      <div className={styles.description}>
        <Image
          src="/indaga.svg"
          alt="Indaga Logo"
          className={styles.logo}
          width={470}
          height={150}
          priority
        />
      </div>
    </main>
  );
}
