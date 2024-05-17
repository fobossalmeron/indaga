import Image from "next/image";
import styles from "./page.module.css";

export default function CafeSanFrancisco() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Image
          src="/indaga.svg"
          alt="Indaga Logo"
          className={styles.logo}
          width={280}
          height={90}
          priority
        />
        <p className={styles.t1}>Gracias por estar aquí</p>
        <p  className={styles.t2}>Acércate a la barra y compárteles el código:</p>
        <p  className={styles.t3}>Golfo de México</p>
      </div>
    </main>
  );
}
