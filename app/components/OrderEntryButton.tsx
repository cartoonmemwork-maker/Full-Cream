"use client";

import type { MouseEvent } from "react";
import { useState } from "react";

const DEPARTURE_DURATION = 460;

export default function OrderEntryButton() {
  const [departing, setDeparting] = useState(false);

  const openOrders = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    event.preventDefault();
    if (departing) return;

    setDeparting(true);
    window.setTimeout(() => window.location.assign("/pedidos/"), DEPARTURE_DURATION);
  };

  return (
    <a
      className="button order-entry-button"
      data-departing={departing || undefined}
      href="/pedidos/"
      onClick={openOrders}
    >
      Hacer un pedido
    </a>
  );
}
