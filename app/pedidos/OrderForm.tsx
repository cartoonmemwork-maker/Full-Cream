"use client";

import { FormEvent, useMemo, useState } from "react";
import OrderTruckIcon from "../components/OrderTruckIcon";
import {
  flavorCatalog,
  flavorGroups,
  packaging,
  WHATSAPP_NUMBER,
} from "./order-data";
import styles from "./pedidos.module.css";

type Quantities = Record<string, number>;

const quantityKey = (groupId: string, item: string) => `${groupId}::${item}`;

function safeQuantity(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(999, Math.floor(value)));
}

type StepperProps = {
  item: string;
  itemKey: string;
  quantity: number;
  onChange: (key: string, quantity: number) => void;
};

function QuantityStepper({ item, itemKey, quantity, onChange }: StepperProps) {
  return (
    <div className={styles.stepper} data-selected={quantity > 0 || undefined}>
      <button
        type="button"
        onClick={() => onChange(itemKey, quantity - 1)}
        disabled={quantity === 0}
        aria-label={`Quitar una unidad de ${item}`}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min="0"
        max="999"
        value={quantity}
        onChange={(event) => onChange(itemKey, Number(event.target.value))}
        aria-label={`Cantidad de ${item}`}
      />
      <button
        type="button"
        onClick={() => onChange(itemKey, quantity + 1)}
        aria-label={`Agregar una unidad de ${item}`}
      >
        +
      </button>
    </div>
  );
}

export default function OrderForm() {
  const [quantities, setQuantities] = useState<Quantities>({});
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [customerCode, setCustomerCode] = useState("");

  const setQuantity = (key: string, value: number) => {
    const nextValue = safeQuantity(value);

    setQuantities((current) => {
      if (nextValue === 0) {
        const next = { ...current };
        delete next[key];
        return next;
      }

      return { ...current, [key]: nextValue };
    });
  };

  const groupTotals = useMemo(
    () =>
      Object.fromEntries(
        flavorGroups.map((group) => [
          group.id,
          group.items.reduce(
            (total, item) => total + (quantities[quantityKey(group.id, item)] ?? 0),
            0,
          ),
        ]),
      ),
    [quantities],
  );

  const totalBuckets = Object.values(groupTotals).reduce((total, value) => total + value, 0);
  const totalPackaging = packaging.reduce(
    (total, item) => total + (quantities[quantityKey("envases", item)] ?? 0),
    0,
  );
  const hasOrder = totalBuckets > 0 || totalPackaging > 0;

  const selectedFlavorGroups = flavorGroups
    .map((group) => ({
      ...group,
      selected: group.items
        .map((item) => ({ item, quantity: quantities[quantityKey(group.id, item)] ?? 0 }))
        .filter(({ quantity }) => quantity > 0),
    }))
    .filter(({ selected }) => selected.length > 0);

  const selectedPackaging = packaging
    .map((item) => ({ item, quantity: quantities[quantityKey("envases", item)] ?? 0 }))
    .filter(({ quantity }) => quantity > 0);

  const listenUrl = useMemo(() => {
    const encodedFlavors = flavorCatalog
      .flatMap((entry, index) => {
        const quantity = quantities[quantityKey(entry.groupId, entry.item)] ?? 0;
        return quantity > 0
          ? [`${index.toString(36)}.${quantity.toString(36)}`]
          : [];
      })
      .join(",");

    const encodedPackaging = packaging
      .flatMap((item, index) => {
        const quantity = quantities[quantityKey("envases", item)] ?? 0;
        return quantity > 0
          ? [`${index.toString(36)}.${quantity.toString(36)}`]
          : [];
      })
      .join(",");

    const encodedParams = [
      encodedFlavors ? `p=${encodedFlavors}` : "",
      encodedPackaging ? `e=${encodedPackaging}` : "",
    ]
      .filter(Boolean)
      .join("&");

    return encodedParams
      ? `https://fullcream.online/e/?${encodedParams}`
      : "";
  }, [quantities]);

  const buildMessage = () => {
    const lines = [
      "*PEDIDO FULL CREAM*",
      "",
      `*Nombre:* ${name.trim()}`,
      `*Dirección:* ${address.trim()}`,
    ];

    if (customerCode.trim()) lines.push(`*Código N°:* ${customerCode.trim()}`);

    if (selectedFlavorGroups.length > 0) {
      lines.push("", "*BALDES DE 15 LITROS*");

      selectedFlavorGroups.forEach((group) => {
        lines.push("", `*${group.name.toUpperCase()}*`);
        group.selected.forEach(({ item, quantity }) => lines.push(`• ${item}: ${quantity}`));
        lines.push(`Subtotal ${group.name}: ${groupTotals[group.id]}`);
      });

      lines.push("", `*TOTAL DE BALDES: ${totalBuckets}*`);
    }

    if (selectedPackaging.length > 0) {
      lines.push("", "*ENVASES*");
      selectedPackaging.forEach(({ item, quantity }) => lines.push(`• ${item}: ${quantity}`));
    }

    if (listenUrl) lines.push("", `Escuchar 🔊 ${listenUrl}`);

    return lines.join("\n");
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasOrder) return;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const clearOrder = () => {
    if (!hasOrder || window.confirm("¿Querés vaciar todo el pedido?")) {
      setQuantities({});
    }
  };

  const renderGroup = (group: (typeof flavorGroups)[number]) => (
    <section className={styles.orderGroup} key={group.id} aria-labelledby={`title-${group.id}`}>
      <div className={styles.groupTitle}>
        <h2 id={`title-${group.id}`}>{group.name}</h2>
        <span>{groupTotals[group.id]} baldes</span>
      </div>
      <div className={styles.rows}>
        {group.items.map((item) => {
          const key = quantityKey(group.id, item);
          const quantity = quantities[key] ?? 0;

          return (
            <div className={styles.orderRow} data-selected={quantity > 0 || undefined} key={key}>
              <span>{item}</span>
              <QuantityStepper item={item} itemKey={key} quantity={quantity} onChange={setQuantity} />
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <form className={styles.form} onSubmit={submitOrder}>
      <section className={styles.customerCard} aria-labelledby="datos-cliente">
        <div className={styles.cardHeading}>
          <span>01</span>
          <div>
            <h2 id="datos-cliente">Datos del pedido</h2>
            <p>Completá los mismos datos de la nota de entrega.</p>
          </div>
        </div>

        <div className={styles.customerFields}>
          <label>
            Nombre
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="Nombre o heladería"
              required
            />
          </label>
          <label>
            Dirección
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              autoComplete="street-address"
              placeholder="Dirección de entrega"
              required
            />
          </label>
          <label>
            Código N° <small>Opcional</small>
            <input
              type="text"
              value={customerCode}
              onChange={(event) => setCustomerCode(event.target.value)}
              inputMode="numeric"
              placeholder="Código de cliente"
            />
          </label>
        </div>
      </section>

      <div className={styles.stepHeading}>
        <span>02</span>
        <div>
          <h2>Elegí las cantidades</h2>
          <p>Cada unidad de sabor corresponde a un balde de 15 litros.</p>
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.sheet}>
          <div className={styles.sheetColumn}>
            {flavorGroups.slice(0, 3).map(renderGroup)}
          </div>

          <div className={styles.sheetColumn}>
            {renderGroup(flavorGroups[3])}

            <section className={`${styles.orderGroup} ${styles.packagingGroup}`} aria-labelledby="title-envases">
              <div className={styles.groupTitle}>
                <h2 id="title-envases">Envases</h2>
                <span>{totalPackaging} unidades</span>
              </div>
              <div className={styles.rows}>
                {packaging.map((item) => {
                  const key = quantityKey("envases", item);
                  const quantity = quantities[key] ?? 0;

                  return (
                    <div className={styles.orderRow} data-selected={quantity > 0 || undefined} key={key}>
                      <span>{item}</span>
                      <QuantityStepper item={item} itemKey={key} quantity={quantity} onChange={setQuantity} />
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <aside className={styles.summary} id="resumen-pedido" aria-labelledby="title-resumen">
          <div className={styles.summaryEyebrow}>03 · Revisá antes de enviar</div>
          <div className={styles.summaryTitle}>
            <h2 id="title-resumen">Tu pedido</h2>
            <OrderTruckIcon className={styles.summaryTruck} />
          </div>

          {!hasOrder ? (
            <div className={styles.emptySummary}>
              <span>0</span>
              <p>Usá los botones + para agregar baldes o envases.</p>
            </div>
          ) : (
            <div className={styles.selectedItems}>
              {selectedFlavorGroups.map((group) => (
                <div className={styles.selectedGroup} key={group.id}>
                  <strong>{group.name}</strong>
                  {group.selected.map(({ item, quantity }) => (
                    <p key={item}>
                      <span>{item}</span>
                      <b>{quantity}</b>
                    </p>
                  ))}
                </div>
              ))}

              {selectedPackaging.length > 0 && (
                <div className={styles.selectedGroup}>
                  <strong>Envases</strong>
                  {selectedPackaging.map(({ item, quantity }) => (
                    <p key={item}>
                      <span>{item}</span>
                      <b>{quantity}</b>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={styles.categoryTotals}>
            {flavorGroups.map((group) => (
              <p key={group.id}>
                <span>{group.name}</span>
                <strong>{groupTotals[group.id]}</strong>
              </p>
            ))}
          </div>

          <div className={styles.grandTotal}>
            <span>Total de baldes</span>
            <strong>{totalBuckets}</strong>
          </div>

          <button className={styles.whatsappSubmit} type="submit" disabled={!hasOrder}>
            <img src="/images/whatsapp-icon.png" width="122" height="121" alt="" />
            Redactar pedido en WhatsApp
          </button>
          <p className={styles.confirmationNote}>
            Vas a poder revisar el mensaje antes de enviarlo.
          </p>
          <button className={styles.clearButton} type="button" onClick={clearOrder} disabled={!hasOrder}>
            Vaciar pedido
          </button>
        </aside>
      </div>

      {hasOrder && (
        <a className={styles.mobileOrderBar} href="#resumen-pedido">
          <span>
            <strong>{totalBuckets}</strong> {totalBuckets === 1 ? "balde" : "baldes"}
          </span>
          <span className={styles.mobileReviewAction}>
            Revisar pedido
            <OrderTruckIcon className={styles.mobileReviewTruck} />
          </span>
        </a>
      )}
    </form>
  );
}
