import type { Metadata } from "next";
import Link from "next/link";
import ListenOrder from "./ListenOrder";
import styles from "./escuchar.module.css";

export const metadata: Metadata = {
  title: "Escuchar pedido | Full Cream",
  description: "Escuchá los sabores, baldes y envases del pedido Full Cream.",
  alternates: { canonical: "/e/" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Escuchar pedido 🔊 | Full Cream",
    description: "Reproducí los sabores, baldes y envases de este pedido.",
    url: "/e/",
  },
};

export default function ListenPage() {
  return (
    <>
      <a className="skip-link" href="#pedido-para-escuchar">
        Ir al pedido
      </a>

      <header className="site-header">
        <div className={"container nav-shell " + styles.listenNav}>
          <Link className="brand" href="/" aria-label="Full Cream, volver al inicio">
            <img
              src="/images/full-cream-logo.png"
              width="499"
              height="135"
              alt="Full Cream"
            />
          </Link>
          <span className={styles.navLabel}>Dictado de pedido</span>
          <Link className={styles.backLink} href="/pedidos/">
            Nuevo pedido
          </Link>
        </div>
      </header>

      <main className={styles.page} id="pedido-para-escuchar">
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Pedido Full Cream</p>
            <h1>Escuchar pedido</h1>
            <p className={styles.heroText}>
              Primero se reproducen los sabores y sus baldes; al final, los envases y sus paquetes.
            </p>
          </div>
        </section>

        <section className={styles.shell} aria-label="Reproductor del pedido">
          <div className={styles.card}>
            <ListenOrder />
          </div>
          <p className={styles.footerNote}>
            Este enlace contiene únicamente sabores, baldes, envases y paquetes. No incluye datos del cliente.
          </p>
        </section>
      </main>
    </>
  );
}
