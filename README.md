# Changuito 🛒 - La Planilla Cooperativa de tu Hogar

Changuito es una aplicación web **mobile-first** diseñada para eliminar el caos de las compras hogareñas mediante la colaboración en tiempo real. Recupera la calidez de la "planilla de la heladera" con una estética de mercado de barrio, priorizando la **fricción cero** y la eficiencia familiar.

---

## 🌟 Propósito
Transformar la tarea rutinaria de hacer las compras en una experiencia compartida, visualmente agradable y extremadamente rápida. Cualquier miembro de la familia, desde los hijos hasta los abuelos, puede anotar "falta leche" en menos de tres segundos.

## 🎨 Pilares de Diseño
- **Fricción Cero:** Uso mínimo del teclado. Carga de productos mediante interacciones de un solo toque.
- **Densidad Visual Máxima:** Visualización de múltiples artículos por pantalla (sin fotos) para un escaneo rápido y eficiente.
- **Estética Artesanal:** Texturas orgánicas (madera, hierro) y paleta de colores de mercado (verdes, cremas y celestes).
- **Consistencia Multidispositivo:** Interfaz adaptable con Tab Bar inferior en móvil y Side Navigation persistente en desktop.

## 🚀 Funcionalidades Principales

### A. Gestión de Listas de Compra
- **Listas Múltiples:** Crea carpetas separadas para el Súper, la Carnicería o la Verdulería.
- **Modo Checklist:** Marcado de productos con feedback visual táctil y cambios de contraste.
- **Sincronización en Vivo:** Cambios instantáneos en todos los dispositivos de la familia.

### B. Inventario General (Carga Rápida)
- **Grilla de Artículos:** Panel denso de productos comunes para una carga masiva sin scroll infinito.
- **Categorización Inteligente:** Filtros rápidos por pasillo (Lácteos, Almacén, Limpieza).
- **Control Stepper Protagonista:** Botones `[-] 0 [+]` grandes para ajustar cantidades al instante.

### C. Colaboración Familiar
- **Onboarding Físico (Código QR):** Suma integrantes escaneando un código desde el perfil del administrador.
- **Notificaciones:** Avisos automáticos cuando alguien inicia una nueva lista.

### D. Seguridad y Acceso
- **Flujo de Auth Completo:** Registro familiar, Inicio de Sesión y Recuperación de contraseña con estándares de accesibilidad WCAG AA.

---

## 🗺️ Mapa de Pantallas
1. **Auth:** Login, Registro y Recuperación (Fondo celeste, alto contraste).
2. **Dashboard (Mis Listas):** Vista general de listas activas y su última actualización.
3. **Inventario:** Grilla compacta de precarga de artículos.
4. **Modo Compra:** Vista de ejecución con productos agrupados por categorías.
5. **Mi Familia:** Gestión de integrantes y código QR de invitación.

---

## 🛠️ Especificaciones Técnicas
- **Frontend:** React + TypeScript + Tailwind CSS v4.
- **Backend:** NestJS + TypeScript.
- **Navegación:**
  - **Móvil:** Tab Bar inferior (Inicio, Mis Listas, Inventario, Mi Familia).
  - **Desktop:** Side Navigation Bar a la izquierda.
- **Idioma:** 100% Localización en Español.
- **Accesibilidad:** Contraste garantizado para legibilidad en entornos de mucha luz (como el supermercado).

---
*Desarrollado con ❤️ para las familias que quieren comprar mejor y más rápido.*