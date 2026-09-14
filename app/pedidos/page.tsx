import type { Metadata } from "next";
import Link from "next/link";
import OrderForm from "./OrderForm";
import styles from "./pedidos.module.css";

export const metadata: Metadata = {
  title: "Pedidos | Full Cream",
  description: "Armá tu pedido de baldes de helado y envases para enviarlo por WhatsApp.",
  alternates: { canonical: "/pedidos/" },
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <>
      <a className="skip-link" href="#contenido-pedidos">
        Ir al formulario
      </a>

      <header className="site-header">
        <div className={`container nav-shell ${styles.orderNav}`}>
          <Link className="brand" href="/" aria-label="Full Cream, volver al inicio">
            <img
              src="/images/full-cream-logo.png"
              width="499"
              height="135"
              alt="Full Cream"
            />
          </Link>
          <span className={styles.navLabel}>Panel de pedidos</span>
          <Link className={styles.backLink} href="/">
            Volver al sitio
          </Link>
        </div>
      </header>

      <main className={styles.page} id="contenido-pedidos">
        <section className={styles.orderHero}>
          <div className="container">
            <p className={styles.eyebrow}>Pedidos para clientes</p>
            <h1>Armá tu pedido</h1>
            <p>
              Seleccioná la cantidad de baldes de 15 litros y los envases que necesitás.
              Al finalizar, preparamos el mensaje para enviarlo por WhatsApp.
            </p>
          </div>
        </section>

        <div className="container">
          <OrderForm />
        </div>
      </main>

      <footer>
        <div className="container footer-row">
          <Link className="footer-logo" href="/" aria-label="Full Cream, volver al inicio">
            <img src="/images/full-cream-logo.png" width="499" height="135" alt="Full Cream" />
          </Link>
          <p>Full Cream © 2026</p>
        </div>
      </footer>
    </>
  );
}
