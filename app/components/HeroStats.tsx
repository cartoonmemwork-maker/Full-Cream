"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 60, prefix: "+", label: "Sabores", href: "#sabores" },
  { value: 20, prefix: "+", label: "Sucursales", href: "#heladeria" },
  { value: 1, prefix: "", label: "Fábrica", href: "#contacto" },
];

export default function HeroStats() {
  const listRef = useRef<HTMLUListElement>(null);
  const [values, setValues] = useState(stats.map((stat) => stat.value));
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    const element = listRef.current;
    if (!element) {
      return;
    }

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) {
          return;
        }

        started = true;
        setIsCounting(true);
        const duration = 1400;
        const start = performance.now();

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setValues(stats.map((stat) => Math.round(stat.value * eased)));

          if (progress < 1) {
            frame = requestAnimationFrame(animate);
          } else {
            setIsCounting(false);
          }
        };

        setValues(stats.map(() => 0));
        frame = requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ul
      className={isCounting ? "hero-facts is-counting" : "hero-facts"}
      aria-label="Datos de Full Cream"
      ref={listRef}
    >
      {stats.map((stat, index) => (
        <li key={stat.label}>
          <a href={stat.href} aria-label={`Ir a ${stat.label.toLowerCase()}`}>
            <strong>
              {stat.prefix}
              {values[index]}
            </strong>
            <span>{stat.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
