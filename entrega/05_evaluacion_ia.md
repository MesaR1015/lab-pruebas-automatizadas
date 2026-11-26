# Evaluación crítica del uso de IA — Laboratorio Pruebas Automatizadas II + IA

Completar y guardar en `evidencias/paso6_evaluacion_ia/`. Al final, copiar la versión definitiva a `entrega/05_evaluacion_ia.md`.

## 1. Prompts clave utilizados

Pegar 2 o 3 prompts usados, o indicar qué archivos de `/prompts` se adaptaron:

1. "Revisa los requisitos del MVP de StockPascual y ayúdame a identificar los puntos críticos de inventario, movimientos y seguridad para priorizar casos de prueba P0 y P1" (adaptación de `prompts/01_analisis_riesgos.md` y `prompts/02_casos_de_prueba.md`).
2. "Guíame paso a paso para probar en la aplicación web casos de bordes y seguridad, como salidas superiores al stock, ajustes de inventario, valores negativos, XSS y exportación CSV" (adaptación de `prompts/03_exploracion_guiada.md`).
3. "Ayúdame a organizar los hallazgos confirmados durante la ejecución en una matriz de resultados y en un reporte de defectos claro con severidad, prioridad, pasos y evidencia" (adaptación de `prompts/04_automatizacion.md` y el flujo de documentación de defectos).

## 2. Qué acertó la IA

- Ayudó a priorizar y estructurar los 10 casos de prueba (`TC-001` a `TC-010`) cubriendo autenticación, movimientos (`OUT` y `ADJUST`), gestión de productos, roles, seguridad (XSS), Dashboard, búsqueda y exportación CSV.
- Facilitó el ordenamiento de la matriz de ejecución (`Matriz_Ejecucion.csv`) y el formateo del reporte formal (`Reporte_Bugs_StockPascual.csv`) con los campos requeridos (`Bug_ID`, severidad, prioridad, pasos, resultado esperado/actual y evidencia).
- Permitió articular con claridad el impacto funcional y de seguridad de los defectos confirmados (`BUG-001` a `BUG-008`), como el inventario negativo, el comportamiento sumativo de `ADJUST` y el XSS almacenado.

## 3. Qué alucinó o inventó sin evidencia

- En un momento de seguimiento de Git, dio por hecho que un `git push` ya había quedado subido a `main` con un hash concreto antes de que el comando se ejecutara efectivamente en la terminal del usuario.
- Al interpretar inicialmente los resultados de ejecución sin contrastar primero la regla de negocio del rol `operador`, sugirió tratar como posible fallo una restricción que hacía parte del comportamiento esperado del rol.

## 4. Riesgos o bugs que la IA no vio y el equipo sí encontró

- Al no interactuar directamente con el navegador ni inspeccionar el archivo CSV descargado en tiempo real, la comprobación final de comportamientos como la exportación incompleta a CSV (`BUG-008`) o la sensibilidad a mayúsculas/minúsculas en la búsqueda (`BUG-007`) dependió de la ejecución manual en `localhost:3080`.
- Los detalles operativos del entorno local (guardar archivos en VS Code con `Ctrl + S` antes de copiar o hacer commit, y ubicar correctamente la carpeta raíz del repositorio) exigieron validación directa del ejecutor.

## 5. Falsos positivos: la IA dijo “bug” y no lo era

- Considerar inicialmente una posible incidencia sobre el comportamiento del rol `operador` (`TC-006`) cuando, al revisar la regla de acceso, el rol `operador` sí debe impedir editar y eliminar productos y limitarse a registrar movimientos; por ello `TC-006` quedó en `Pass`.

## 6. Momento de mayor valor frente a mayor pérdida de tiempo

| | Descripción |
|--|-------------|
| Mayor valor | Organizar rápidamente los casos, la matriz de ejecución y el reporte CSV de defectos (`BUG-001` a `BUG-008`) alineados con las evidencias obtenidas en las pruebas. |
| Mayor pérdida de tiempo | Repetir copias y commits por tener archivos sin guardar en el editor o asumir estados de Git sin haber corrido primero el comando en la consola. |

## 7. Reflexión, 10 a 15 líneas

No es recomendable contratar un proceso de QA 100 % reemplazado por IA en la Institución Universitaria Pascual Bravo.
En este laboratorio se evidenció que la IA acelera la redacción de casos, matrices y reportes de defectos, pero no reemplaza el criterio humano ni la prueba real sobre el sistema.
Con la IA se estructuraron las pruebas de `StockPascual` y se documentaron fallos reales como salidas que dejan stock negativo (`BUG-001`), ajustes que suman en lugar de reemplazar (`BUG-002`) y XSS almacenado (`BUG-005`).
Sin embargo, también se presentaron errores de contexto, como dar por hecho un `push` no ejecutado o dudar de una regla válida del rol `operador` que debía quedar en `Pass`.
En una institución universitaria, donde se forman ingenieros y se validan aplicaciones que respaldan procesos académicos y operativos, depender ciegamente de la IA expone a falsos positivos, omisiones y errores no verificados.
La IA debe funcionar como un apoyo o copiloto del equipo de QA, mientras que el analista humano valida las reglas de negocio, ejecuta sobre el entorno real y decide con criterio sobre la calidad del software.
