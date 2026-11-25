# Notas críticas sobre la salida de la IA — StockPascual

Evaluación de las limitaciones, sesgos y vacíos detectados en la matriz de riesgos generada por la IA para el MVP **StockPascual** (Institución Universitaria Pascual Bravo).

---

### 1. Lo que la IA inventó o asumió fuera del alcance
* **Matriz de permisos no especificada (Riesgo #4):** El contexto solo indicaba *"Login con roles admin y operador"*, pero la IA asumió sin validación que el rol `operador` tiene prohibido ejecutar `ADJUST`, editar precios o eliminar productos. En la práctica institucional, esa regla depende de la política interna del almacén y debe confirmarse con el dueño del producto antes de considerarla un defecto.
* **Requisitos de seguridad no solicitados (Riesgos #9 y #11):** Introdujo validaciones como *CSV Formula Injection* (`=1+1`, `@SUM`) y un *"tiempo límite definido"* de expiración de sesión por inactividad en un *"PC compartido"*. Aunque son buenas prácticas, no forman parte del alcance explícito del MVP.

---

### 2. Lo que la IA subestimó
* **El problema de la valoración de inventario ante cambios de precio (Riesgo #3):** La IA redujo el riesgo financiero a errores de redondeo decimal o falta de recálculo en el Dashboard, pero subestimó un problema propio del dominio de inventarios: al existir un único campo `precio` por producto en el CRUD, actualizar el precio por una nueva compra altera retrospectivamente el valor de todo el stock antiguo (sin costo promedio ponderado ni histórico), lo que puede distorsionar las decisiones administrativas.
* **La transición desde Excel y la calidad del inventario inicial:** Aunque la historia de negocio destaca las diferencias entre el stock físico y Excel, la IA no incluyó como riesgo prioritario el **arranque del piloto con datos inconsistentes** (unidades de medida mezcladas —por ejemplo, cajas vs. unidades sueltas para laboratorios—, SKUs heredados sin estándar o precios en `0`).
* **Probabilidad del borrado físico con historial (Riesgo #12):** Lo ubicó en el último puesto con probabilidad *Baja*. Sin embargo, en un MVP académico o temprano es muy probable que un CRUD básico implemente `DELETE` físico por defecto sin validar integridad referencial, y que durante el piloto se borren productos de prueba que ya tienen movimientos.

---

### 3. Lo que quedó genérico
* **Pruebas estándar de aplicaciones web disfrazadas de inventario (Riesgos #10 y #11):** El cierre de sesión con el botón "Atrás" del navegador y el doble clic bajo *throttling* de red son pruebas genéricas aplicables a casi cualquier formulario web. Faltó profundizar en usabilidad específica del almacén universitario, como la confusión al buscar insumos por `ubicación` o `categoría` durante entregas rápidas a laboratorios.
* **Falta de matices del dominio en las ideas de prueba (Riesgo #2 y datos de prueba):** Sugerir *"simular corte de red o error 500 para comprobar rollback"* es una recomendación genérica de bases de datos. Además, la IA no contempló casos propios de laboratorios universitarios, como insumos **fraccionables** (litros, gramos, metros) frente a insumos **enteros** (equipos o herramientas), ni el manejo de `stock mínimo = 0`.

---

### 4. Acción recomendada para el equipo QA antes del piloto
1. **Validar reglas de negocio faltantes** con el almacén (permisos exactos de `operador`, definición de `ADJUST` como conteo físico vs. delta, y si se permiten cantidades decimales).
2. **Añadir una verificación previa al piloto** sobre el inventario base cargado en StockPascual para evitar arrastrar los descuadres históricos de Excel.