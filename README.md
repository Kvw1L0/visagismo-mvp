# Visagismo Studio (MVP)

Aplicación web de **Visagismo y Colorimetría** impulsada por **MediaPipe Face Landmarker** (478 puntos faciales 3D) ejecutándose 100% en el navegador.

## Funcionalidades del MVP
- **Captura Dual:** Análisis mediante subida de fotografía (drag & drop) o cámara web en vivo con guía de alineación facial.
- **Morfometría Facial:** Cálculo de relación largo/ancho, proporción frente/mandíbula, ángulo mandibular, simetría horizontal y tercios faciales.
- **Clasificación de Rostro:** Detecta 7 morfologías (*Ovalado, Redondo, Cuadrado, Alargado/Rectangular, Diamante, Corazón y Triángulo*).
- **Colorimetría Básica:** Muestreo de piel en mejillas y frente para estimar subtono (*Cálido, Frío, Neutro*) con sugerencia de metales, tintes y paleta de colores.
- **Recomendaciones de Estilo:** Cortes de cabello (femenino/masculino), barba, cejas, maquillaje/contouring, gafas y qué evitar.
- **Visualización & Exportación:** Overlay interactivo con líneas de medición sobre el rostro y botón para imprimir o guardar la ficha en PDF.

## Cómo ejecutarlo localmente

```bash
node server.mjs
```

Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador.
