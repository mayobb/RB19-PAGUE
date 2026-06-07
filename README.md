# 🏎️ RB19 — Cinematic Experience

Fan page interactiva del **Red Bull RB19**, el monoplaza más dominante en la historia de la Fórmula 1 (temporada 2023).

## 🚀 Demo

[https://mayobb.github.io/RB19-PAGUE](https://mayobb.github.io/RB19-PAGUE)

## ✨ Características

- **Video background** con efecto cinematográfico
- **Animaciones** al hacer scroll (reveal, parallax, contadores)
- **Modelo 3D** del RB19 interactivo con model-viewer
- **Línea de tiempo** con los 22 GP de la temporada 2023
- **Comparativa histórica** vs. MP4/4, F2004, W07, W11
- **Galería** con lightbox
- **Modal de video onboard**
- **Clasificación de constructores 2023** con gráfico de barras
- **Bilingüe** (ES/EN) con toggle en toolbar
- **Night mode** (Las Vegas)
- **Efecto de lluvia** en canvas (se pausa al cambiar de pestaña)
- **Cursor glow** y fondo animado (blobs, mariposas SVG)
- **Service Worker** con caché offline
- **Modo fin de carrera** con horario de sesiones
- **Contador de visitas** (localStorage)
- **Descarga de wallpaper** generado en canvas

## 🛠️ Tecnologías

- HTML5, CSS3, JavaScript vanilla
- [model-viewer](https://modelviewer.dev/) para modelo 3D
- Google Fonts (Inter)
- Service Worker API

## 📦 Estructura

```
├── index.html          # Página principal
├── sw.js               # Service Worker
├── assets/
│   ├── css/style.css   # Estilos
│   ├── js/script.js    # Lógica JS
│   ├── models/rb19/    # Modelo 3D del RB19
│   ├── images/         # Drivers y galería
│   ├── videos/         # Background y onboard
│   └── audio/          # Música de fondo
└── README.md
```

## ▶️ Uso local

```bash
python3 -m http.server 8000
# o
npx serve .
```

El sitio es completamente estático — no requiere build.

## 🏆 Records del RB19 (2023)

| Métrica | Valor |
|---------|-------|
| Victorias | 21 de 22 |
| Puntos | 860 |
| Poles | 15 |
| Vueltas rápidas | 11 |
| Porcentaje de victorias | 95.5% |
