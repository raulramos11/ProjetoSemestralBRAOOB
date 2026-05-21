import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <img src="/src/assets/logo_nobg.png" alt="Rank It Up" className={styles.logo} />
      <p className={styles.title}>Rank It Up!</p>
      <ul className={styles.nav}>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </header>
  )
}