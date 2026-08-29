"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";

const slides = [
  {
    src: "/images/fabrica-produccion.webp",
    alt: "Instalaciones de producción de la fábrica de helados Full Cream",
    label: "Fábrica",
    width: 1280,
    height: 720,
    position: "center",
  },
  {
    src: "/images/helados-fut.webp",
    alt: "Helado Full Cream con crema, chocolate y frutos rojos",
    label: "Helados",
    width: 2000,
    height: 1200,
    position: "center",
  },
  {
    src: "/images/sabores-full-cream.webp",
    alt: "Conservadoras con distintos sabores de helado Full Cream",
    label: "Sabores",
    width: 2000,
    height: 1200,
    position: "55% center",
  },
  {
    src: "/images/helado-full-cream-2048.webp",
    alt: "Conservadoras de helado en la fábrica Full Cream",
    label: "Equipos",
    width: 2048,
    height: 1152,
    position: "34% center",
  },
  {
    src: "/images/heladeria-full-cream.webp",
    alt: "Heladería equipada con productos Full Cream",
    label: "Locales",
    width: 1280,
    height: 720,
    position: "center",
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const activeSlide = slides[active];

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [active, paused]);

  useEffect(() => {
    const nextSlide = slides[(active + 1) % slides.length];
    const preload = new window.Image();
    preload.src = nextSlide.src;
  }, [active]);

  const goTo = (index: number) => {
    setActive((index + slides.length) % slides.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    setPaused(true);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];

    if (start && touch) {
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goTo(active + (deltaX < 0 ? 1 : -1));
      }
    }

    touchStart.current = null;
    setPaused(false);
  };

  return (
    <div
      className="hero-visual carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Imágenes de Full Cream"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null;
        setPaused(false);
      }}
    >
      <div className="carousel-images">
        <img
          className="carousel-image"
          src={activeSlide.src}
          width={activeSlide.width}
          height={activeSlide.height}
          style={{ objectPosition: activeSlide.position }}
          alt={activeSlide.alt}
          loading="eager"
          fetchPriority={active === 0 ? "high" : "auto"}
          decoding="async"
          key={activeSlide.src}
        />
      </div>

      <div className="hero-badge">
        <img
          className="carousel-brand-logo"
          src="/images/full-cream-logo.png"
          width="499"
          height="135"
          alt="Full Cream"
        />
        <strong>{activeSlide.label}</strong>
      </div>

      <button
        className="carousel-arrow carousel-prev"
        type="button"
        aria-label="Imagen anterior"
        onClick={() => goTo(active - 1)}
      >
        ‹
      </button>
      <button
        className="carousel-arrow carousel-next"
        type="button"
        aria-label="Imagen siguiente"
        onClick={() => goTo(active + 1)}
      >
        ›
      </button>

      <div className="carousel-dots" aria-label="Elegir imagen">
        {slides.map((slide, index) => (
          <button
            className={index === active ? "is-active" : ""}
            type="button"
            aria-label={`Ver imagen: ${slide.label}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => goTo(index)}
            key={slide.src}
          />
        ))}
      </div>
    </div>
  );
}
