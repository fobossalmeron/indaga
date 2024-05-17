import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <link rel="icon" href="/favicon.ico" sizes="any" />
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
      <div className={styles.footer}>
        <a href="mailto:hello@indaga.site">Contacto</a>© Indaga, 2024
      </div>
    </main>
  );
}
