import HeroCarousel from "./components/HeroCarousel";
import HeroStats from "./components/HeroStats";
import OrderEntryButton from "./components/OrderEntryButton";
import OrderTruckIcon from "./components/OrderTruckIcon";
import SmoothAnchorFallback from "./components/SmoothAnchorFallback";

const whatsappUrl =
  "https://wa.me/5491158130577?text=Hola%20Full%20Cream%2C%20quiero%20recibir%20informaci%C3%B3n%20para%20abrir%20mi%20helader%C3%ADa.";

const flavors = [
  {
    name: "Al agua",
    accent: "lemon",
    items: [
      "Ananá",
      "Durazno",
      "Frambuesa",
      "Frutilla",
      "Limón",
      "Manzana",
      "Melón",
    ],
  },
  {
    name: "Cremas",
    accent: "cream",
    items: [
      "Americana",
      "Banana",
      "Coco",
      "Crema del cielo",
      "Limón granizado",
      "Limón premium",
      "Menta granizada",
      "Pistacho",
      "Tiramisú",
      "Vainilla",
    ],
  },
  {
    name: "Especiales",
    accent: "strawberry",
    items: [
      "Almendras",
      "Banana Split",
      "Cereza",
      "Chocolate",
      "Chocolate al rhum",
      "Chocolate blanco",
      "Chocolate granizado",
      "Crema Oreo",
      "Dulce de leche",
      "Flan",
      "Frutilla a la americana",
      "Frutilla a la crema",
      "Frutos del bosque",
      "Granizado",
      "Kinoto al whisky",
      "Mantecol",
      "Marroc",
      "Sabayón",
      "Tramontana",
    ],
  },
  {
    name: "Extras",
    accent: "chocolate",
    items: [
      "Abachoc",
      "Banana Dolca",
      "Cabsha",
      "Cadbury",
      "Chocolate amargo",
      "Chocolate Bariloche",
      "Chocolate blanco pistacho",
      "Chocolate con almendras",
      "Chocolate con dulce de leche",
      "Chocolate Kinder",
      "Chocolate pistacho",
      "Chocolate Rocher",
      "Chocolate Shot",
      "Crema rusa",
      "Dulce bombón",
      "Dulce de leche con nuez",
      "Dulce de leche granizado",
      "Frannui",
      "Maracuyá",
      "Mascarpone",
      "Rodhesia",
      "Sambayón con cereza",
      "Serenito",
      "Súper dulce de leche",
      "Toffi",
    ],
  },
];

const newFlavors = new Set([
  "Chocolate blanco pistacho",
  "Chocolate pistacho",
]);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://fullcream.online/#website",
      url: "https://fullcream.online/",
      name: "Full Cream",
      alternateName: "Helados Full Cream",
      inLanguage: "es-AR",
      publisher: { "@id": "https://fullcream.online/#business" },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://fullcream.online/#business",
      name: "Full Cream",
      alternateName: "Helados Full Cream",
      description:
        "Fábrica de helados por mayor en Villa Bosch con más de 60 sabores y equipamiento para heladerías.",
      url: "https://fullcream.online/",
      telephone: "+54 11 5813-0577",
      logo: {
        "@type": "ImageObject",
        url: "https://fullcream.online/images/full-cream-logo.png",
        width: 499,
        height: 135,
      },
      image: [
        "https://fullcream.online/images/fabrica-produccion.webp",
        "https://fullcream.online/images/helado-full-cream-2048.webp",
        "https://fullcream.online/images/heladeria-full-cream.webp",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Gral. López 951",
        addressLocality: "Villa Bosch",
        addressRegion: "Provincia de Buenos Aires",
        postalCode: "B1682",
        addressCountry: "AR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -34.578121,
        longitude: -58.5846183,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+54 11 5813-0577",
        contactType: "ventas",
        availableLanguage: "Spanish",
      },
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Helados por mayor",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Equipamiento para heladerías",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <SmoothAnchorFallback />
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>

      <header className="site-header">
        <div className="container nav-shell">
          <a className="brand" href="#inicio" aria-label="Full Cream, inicio">
            <img
              src="/images/full-cream-logo.png"
              width="499"
              height="135"
              alt="Full Cream"
            />
          </a>

          <nav aria-label="Navegación principal">
            <a href="#sabores">Sabores</a>
            <a href="/pedidos/">Pedidos</a>
            <a href="#heladeria">Abrí tu heladería</a>
            <a href="#contacto">Ubicación</a>
          </nav>

          <a className="nav-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
            <img
              className="whatsapp-wordmark"
              src="/images/whatsapp-wordmark.svg"
              width="125"
              height="29"
              alt="WhatsApp"
            />
          </a>

          <a
            className="nav-order-shortcut"
            href="/pedidos/"
            aria-label="Ir al panel de pedidos"
          >
            <OrderTruckIcon className="nav-order-icon" />
          </a>
        </div>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Fábrica de helados por mayor</p>
              <h1>
                <span className="hero-title-line">¿Querés abrir</span>{" "}
                <span className="hero-title-line hero-title-line-middle">
                  tu <em>propia</em>
                </span>{" "}
                <span className="hero-title-line">heladería?</span>
              </h1>
              <p className="hero-lead">
                Fabricamos helados y te ayudamos a equipar tu local. Contamos
                con más de 60 sabores, para que tu heladería ofrezca la más
                amplia variedad del mercado desde el primer día.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#heladeria">
                  Quiero abrir mi heladería
                </a>
                <img
                  className="store-vector"
                  src="/images/tienda-vector.png"
                  width="144"
                  height="112"
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <HeroStats />
            </div>

            <HeroCarousel />
          </div>
        </section>

        <section className="section flavors" id="sabores">
          <div className="container">
            <div className="section-heading flavors-heading">
              <h2>Sabores</h2>
              <p>
                Conocé nuestra carta de más de 60 sabores de helado, organizada
                en cuatro categorías.
              </p>
            </div>

            <div className="flavor-grid">
              {flavors.map((group, index) => (
                <details className={`flavor-card ${group.accent}`} key={group.name} open={index === 0}>
                  <summary>
                    <strong>{group.name}</strong>
                    <span className="flavor-count">{group.items.length}</span>
                  </summary>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>
                        {item}
                        {newFlavors.has(item) && (
                          <span className="new-flavor-badge">Nuevo</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>

            <div className="order-entry">
              <div className="order-entry-main">
                <div className="order-entry-copy">
                  <p className="order-entry-label">
                    Herramienta para clientes Full Cream
                  </p>
                  <h3>Armá tu pedido online</h3>
                  <p>
                    Seleccioná la cantidad de baldes de 15 litros y te preparamos el
                    mensaje para enviarlo por WhatsApp.
                  </p>
                </div>
                <OrderTruckIcon className="order-entry-truck" />
              </div>
              <OrderEntryButton />
            </div>
          </div>
        </section>

        <section className="start" id="heladeria">
          <div className="container start-shell">
            <div>
              <h2>¿Querés abrir tu heladería?</h2>
              <p>Nosotros te equipamos el local.</p>
            </div>
            <a className="button button-light whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer">
              <img src="/images/whatsapp-icon.png" width="122" height="121" alt="" />
              Consultar por WhatsApp
            </a>
          </div>
        </section>

        <section className="section location" id="contacto">
          <div className="container location-grid">
            <div className="location-copy">
              <h2>Fábrica de helados Full Cream en Villa Bosch</h2>
              <address>
                <strong>Gral. López 951</strong>
                <span>Villa Bosch, Provincia de Buenos Aires</span>
                <a href="tel:+541158130577">+54 11 5813-0577</a>
              </address>
            </div>

            <div className="map-shell">
              <iframe
                title="Ubicación de la fábrica Full Cream en Villa Bosch"
                src="https://www.google.com/maps?q=F%C3%A1brica%20de%20helados%20Full%20Cream%2C%20Gral.%20L%C3%B3pez%20951%2C%20Villa%20Bosch%2C%20Provincia%20de%20Buenos%20Aires&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-row">
          <a className="footer-logo" href="#inicio" aria-label="Full Cream, volver al inicio">
            <img src="/images/full-cream-logo.png" width="499" height="135" alt="Full Cream" />
          </a>
          <p>Full Cream © 2026</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
