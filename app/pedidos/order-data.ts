export type OrderGroup = {
  id: string;
  name: string;
  items: readonly string[];
};

// El orden y los nombres reproducen la nota de entrega provista por Full Cream.
export const flavorGroups: readonly OrderGroup[] = [
  {
    id: "agua",
    name: "Agua",
    items: [
      "Ananá",
      "Frutilla",
      "Limón",
      "Durazno",
      "Manzana",
      "Melón",
      "Frambuesa",
    ],
  },
  {
    id: "comun",
    name: "Común",
    items: [
      "Americana",
      "Crema del Cielo",
      "Vainilla",
      "Banana",
      "Coco",
      "Pistaccio",
      "Tiramisu",
      "Limón Granizado",
      "Limón Premium",
      "Menta Granizada",
    ],
  },
  {
    id: "especial",
    name: "Especial",
    items: [
      "Frutilla a la crema",
      "Frutilla a la Americana",
      "Dulce de Leche",
      "Granizado",
      "Cereza",
      "Banana Split",
      "Flan",
      "Sambayón",
      "Almendras",
      "Chocolate",
      "Chocolate Blanco",
      "Chocolate Granizado",
      "Chocolate al Rhum",
      "Kinoto al Wisky",
      "Fruto del Bosque",
      "Marroc",
      "Crema Oreo",
      "Tramontana",
      "Mantecol",
    ],
  },
  {
    id: "extra-especial",
    name: "Extra Especial",
    items: [
      "D. de Leche Granizado",
      "D. de Leche c/Nuez",
      "Super Dulce de Leche",
      "Dulce Bombon",
      "Chocolate Bariloche",
      "Chocolate c/Almendras",
      "Chocolate Rocher",
      "Chocolate Kinder",
      "Chocolate c/Dulce de Leche",
      "Chocolate Shot",
      "Chocolate Amargo",
      "Banana Dolca",
      "Crema Rusa",
      "Mascarpone",
      "Maracuya",
      "Abachoc",
      "Rodhesia",
      "Cabsha",
      "Sambayon c/Cereza",
      "Franui",
      "Cadbury",
      "Serenito",
      "Tofi",
      "Choco Pistacho",
      "Choco blanco pistacho",
    ],
  },
] as const;

// Catálogo plano y estable para generar enlaces cortos de escucha.
// Mantiene exactamente el orden de la nota de entrega.
export const flavorCatalog = flavorGroups.flatMap((group) =>
  group.items.map((item) => ({ groupId: group.id, item })),
);

export const packaging: readonly string[] = [
  "Térmico 1/8 Kg x 50U",
  "Térmico 1/4 Kg x 20U",
  "Térmico 1/2 Kg x 20U",
  "Térmico 1 Kg x 20U",
  "Vasos N° 30",
  "Vasos N° 50",
  "Vasos N° 65",
  "Cucurucho",
  "Servilletas",
  "Cucharitas",
  "Bolsitas Chicas",
  "Bolsitas Grandes",
  "Salsas",
] as const;

export const WHATSAPP_NUMBER = "5491158130577";

