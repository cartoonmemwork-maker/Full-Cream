# Full Cream

Sitio web oficial de Full Cream. Esta copia conserva el diseño y el contenido
publicados y queda preparada para usar GitHub como fuente de verdad y
Cloudflare Pages como hosting.

## Desarrollo

Requiere Node.js 22.

```bash
npm install
npm run dev
```

## Compilación

```bash
npm run build
```

La exportación estática se genera en `out/`.

## Cloudflare Pages

- Comando de compilación: `npm run build`
- Directorio de salida: `out`
- Rama de producción: `main`

El dominio se delegará a Cloudflare después de comprobar el primer despliegue.
