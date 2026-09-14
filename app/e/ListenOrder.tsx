"use client";

import { useEffect, useRef, useState } from "react";
import { flavorCatalog } from "../pedidos/order-data";
import styles from "./escuchar.module.css";

type ListenItem = {
  item: string;
  quantity: number;
};

type PlaybackState = "idle" | "playing" | "paused" | "finished";

function decodeOrder(value: string | null): ListenItem[] {
  if (!value) return [];

  const items: ListenItem[] = [];
  const seen = new Set<number>();

  value.split(",").forEach((token) => {
    if (!/^[0-9a-z]+\.[0-9a-z]+$/i.test(token)) return;

    const [rawIndex, rawQuantity] = token.split(".");
    const index = Number.parseInt(rawIndex, 36);
    const quantity = Number.parseInt(rawQuantity, 36);
    const entry = flavorCatalog[index];

    if (
      Number.isSafeInteger(index) &&
      Number.isSafeInteger(quantity) &&
      entry &&
      !seen.has(index) &&
      quantity > 0 &&
      quantity <= 999
    ) {
      seen.add(index);
      items.push({ item: entry.item, quantity });
    }
  });

  return items;
}

function spokenFlavor(name: string) {
  return name
    .replace(/^D\. de Leche/, "Dulce de Leche")
    .replace(/c\//g, "con ")
    .replace("Wisky", "Whisky");
}

function spokenLine(item: ListenItem) {
  const buckets = item.quantity === 1 ? "un balde" : item.quantity + " baldes";
  return spokenFlavor(item.item) + " " + buckets + ".";
}

export default function ListenOrder() {
  const [items, setItems] = useState<ListenItem[]>([]);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [rate, setRate] = useState(0.88);
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const runIdRef = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setItems(decodeOrder(params.get("p")));
    setSupported(
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
    );
    setReady(true);

    return () => {
      runIdRef.current += 1;
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stopPlayback = () => {
    runIdRef.current += 1;
    window.speechSynthesis.cancel();
    utterancesRef.current = [];
    setPlayback("idle");
    setCurrentIndex(-1);
  };

  const startPlayback = () => {
    if (!supported || items.length === 0) return;

    const synthesis = window.speechSynthesis;
    synthesis.cancel();

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    setCurrentIndex(-1);
    setPlayback("playing");

    const voices = synthesis.getVoices();
    const voice =
      voices.find((candidate) => candidate.lang.toLowerCase() === "es-ar") ??
      voices.find((candidate) => candidate.lang.toLowerCase().startsWith("es"));

    const utterances = items.map((item, index) => {
      const utterance = new SpeechSynthesisUtterance(spokenLine(item));
      utterance.lang = voice?.lang ?? "es-AR";
      utterance.rate = rate;
      utterance.pitch = 1;

      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        if (runIdRef.current === runId) setCurrentIndex(index);
      };

      if (index === items.length - 1) {
        utterance.onend = () => {
          if (runIdRef.current !== runId) return;
          setPlayback("finished");
          setCurrentIndex(-1);
          utterancesRef.current = [];
        };
      }

      utterance.onerror = (event) => {
        if (
          runIdRef.current === runId &&
          event.error !== "canceled" &&
          event.error !== "interrupted"
        ) {
          setPlayback("idle");
          setCurrentIndex(-1);
        }
      };

      return utterance;
    });

    utterancesRef.current = utterances;
    utterances.forEach((utterance) => synthesis.speak(utterance));
  };

  const togglePause = () => {
    if (playback === "playing") {
      window.speechSynthesis.pause();
      setPlayback("paused");
      return;
    }

    if (playback === "paused") {
      window.speechSynthesis.resume();
      setPlayback("playing");
    }
  };

  const changeRate = (nextRate: number) => {
    if (playback === "playing" || playback === "paused") stopPlayback();
    setRate(nextRate);
  };

  const statusText =
    playback === "playing" && currentIndex >= 0
      ? "Escuchando " + (currentIndex + 1) + " de " + items.length
      : playback === "paused"
        ? "Audio pausado"
        : playback === "finished"
          ? "Pedido terminado"
          : "";

  if (!ready) {
    return <div className={styles.loading}>Preparando el pedido…</div>;
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <strong>Este enlace no contiene sabores</strong>
        <p>Pedile al remitente que vuelva a generar el pedido.</p>
      </div>
    );
  }

  if (!supported) {
    return (
      <div className={styles.unsupported}>
        <strong>No pudimos iniciar la voz</strong>
        <p>Podés leer la lista completa debajo desde otro navegador.</p>
        <OrderList items={items} currentIndex={-1} />
      </div>
    );
  }

  return (
    <>
      <div className={styles.controls}>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={startPlayback}
        >
          <span aria-hidden="true">🔊</span>
          {playback === "idle"
            ? "Escuchar"
            : playback === "finished"
              ? "Escuchar de nuevo"
              : "Reiniciar audio"}
        </button>

        <div className={styles.controlRow}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={togglePause}
            disabled={playback !== "playing" && playback !== "paused"}
          >
            {playback === "paused" ? "Continuar" : "Pausar"}
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={stopPlayback}
            disabled={playback === "idle"}
          >
            Detener
          </button>
        </div>

        <div className={styles.ratePicker}>
          <span>Velocidad del dictado</span>
          <div className={styles.rateOptions}>
            <button
              className={styles.rateButton}
              data-active={rate === 0.72 || undefined}
              type="button"
              aria-pressed={rate === 0.72}
              onClick={() => changeRate(0.72)}
            >
              Despacio
            </button>
            <button
              className={styles.rateButton}
              data-active={rate === 0.88 || undefined}
              type="button"
              aria-pressed={rate === 0.88}
              onClick={() => changeRate(0.88)}
            >
              Normal
            </button>
            <button
              className={styles.rateButton}
              data-active={rate === 1 || undefined}
              type="button"
              aria-pressed={rate === 1}
              onClick={() => changeRate(1)}
            >
              Rápido
            </button>
          </div>
        </div>

        <p className={styles.status} aria-live="polite">
          {statusText}
        </p>
      </div>

      <OrderList items={items} currentIndex={currentIndex} />
    </>
  );
}

function OrderList({
  items,
  currentIndex,
}: {
  items: ListenItem[];
  currentIndex: number;
}) {
  return (
    <>
      <div className={styles.listHeading}>
        <h2>Sabores</h2>
        <span>{items.length} seleccionados</span>
      </div>
      <ol className={styles.orderList}>
        {items.map((item, index) => (
          <li
            className={styles.orderItem}
            data-active={currentIndex === index || undefined}
            key={item.item}
          >
            <span className={styles.flavorName}>{item.item}</span>
            <span className={styles.bucketCount}>
              {item.quantity === 1 ? "un balde" : item.quantity + " baldes"}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
