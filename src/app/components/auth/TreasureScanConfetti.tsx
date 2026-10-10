import type { CSSProperties } from "react";
import styles from "./treasure-scan-confetti.module.css";

const colors = ["#65468b", "#a68bc7", "#ffd600", "#00c48c", "#ff6f61"];

export function TreasureScanConfetti() {
  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: 36 }, (_, index) => (
        <span
          key={index}
          className={styles.piece}
          style={{
            "--x": `${((index * 37) % 101) - 50}vw`,
            "--rise": `${-12 - ((index * 7) % 18)}vh`,
            "--rotation": `${((index * 73) % 720) - 360}deg`,
            animationDelay: `${(index % 6) * 35}ms`,
            backgroundColor: colors[index % colors.length],
            borderRadius: index % 3 === 0 ? "50%" : "1px",
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
