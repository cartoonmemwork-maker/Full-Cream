"use client";

import { useEffect, useRef, useState } from "react";
import { flavorCatalog, packaging } from "../pedidos/order-data";
import styles from "./escuchar.module.css";

type ListenKind = "flavor" | "packaging";

type ListenItem = {
  item: string;
  quantity: number;
  kind: ListenKind;
};

type PlaybackState = "idle" | "playing" | "paused" | "finished";

const flavorNames = flavorCatalog.map((entry) => entry.item);

function decodeSelection(
  value: string | null,
  catalog: readonly string[],
  kind: ListenKind,
): ListenItem[] {
  if (!value) return [];

  const items: ListenItem[] = [];
  const seen = new Set<number>();

  value.split(",").forEach((token) => {
    if (!/^[0-9a-z]+\.[0-9a-z]+$/i.test(token)) return;

    const [rawIndex, rawQuantity] = token.split(".");
    const index = Number.parseInt(rawIndex, 36);
    const quantity = Number.parseInt(rawQuantity, 36);
    const item = catalog[index];

    if (
      Number.isSafeInteger(index) &&
      Number.isSafeInteger(quantity) &&
      item !== undefined &&
      !seen.has(index) &&
      quantity > 0 &&
      quantity <= 999
    ) {
      seen.add(index);
      items.push({ item, quantity, kind });
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

const packagingPronunciations: Record<string, string> = {
  "Térmico 1/8 Kg x 50U": "Térmico de un octavo de kilo por cincuenta unidades",
  "Térmico 1/4 Kg x 20U": "Térmico de un cuarto de kilo por veinte unidades",
  "Térmico 1/2 Kg x 20U": "Térmico de medio kilo por veinte unidades",
  "Térmico 1 Kg x 20U": "Térmico de un kilo por veinte unidades",
};

function spokenPackaging(name: string) {
  return (packagingPronunciations[name] ?? name).replace(/N°\s*/g, "número ");
}

function itemUnit(item: ListenItem) {
  if (item.kind === "packaging") {
    return item.quantity === 1 ? "un paquete" : item.quantity + " paquetes";
  }

  return item.quantity === 1 ? "un balde" : item.quantity + " baldes";
}

function spokenLine(item: ListenItem) {
  const name =
    item.kind === "packaging"
      ? spokenPackaging(item.item)
      : spokenFlavor(item.item);

  return name + " " + itemUnit(item) + ".";
}

export default function ListenOrder() {
  const [items, setItems] = useState<ListenItem[]>([]);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [rate, setRate] = useState(1);
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const runIdRef = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flavors = decodeSelection(params.get("p"), flavorNames, "flavor");
    const envases = decodeSelection(params.get("e"), packaging, "packaging");
    setItems([...flavors, ...envases]);
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
        <strong>Este enlace no contiene productos</strong>
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

function OrderSection({
  title,
  items,
  currentIndex,
  offset,
}: {
  title: string;
  items: ListenItem[];
  currentIndex: number;
  offset: number;
}) {
  return (
    <section className={styles.listSection}>
      <div className={styles.listHeading}>
        <h2>{title}</h2>
        <span>
          {items.length} {items.length === 1 ? "seleccionado" : "seleccionados"}
        </span>
      </div>
      <ol className={styles.orderList}>
        {items.map((item, index) => {
          const absoluteIndex = offset + index;

          return (
            <li
              className={styles.orderItem}
              data-active={currentIndex === absoluteIndex || undefined}
              key={item.kind + "::" + item.item}
            >
              <span className={styles.flavorName}>{item.item}</span>
              <span className={styles.bucketCount}>{itemUnit(item)}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function OrderList({
  items,
  currentIndex,
}: {
  items: ListenItem[];
  currentIndex: number;
}) {
  const flavors = items.filter((item) => item.kind === "flavor");
  const envases = items.filter((item) => item.kind === "packaging");

  return (
    <>
      {flavors.length > 0 && (
        <OrderSection
          title="Sabores"
          items={flavors}
          currentIndex={currentIndex}
          offset={0}
        />
      )}
      {envases.length > 0 && (
        <OrderSection
          title="Envases"
          items={envases}
          currentIndex={currentIndex}
          offset={flavors.length}
        />
      )}
    </>
  );
}
