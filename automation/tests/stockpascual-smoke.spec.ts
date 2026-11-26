import { test, expect } from '@playwright/test';

test.describe('StockPascual - Flujo E2E Inventario', () => {
  test('login, crear producto, IN, OUT, validar stock y alerta de stock mínimo', async ({ page }) => {
    // Datos dinámicos para evitar colisiones entre ejecuciones
    const timestamp = Date.now();
    const sku = `SKU-E2E-${timestamp}`;
    const nombreProducto = `Mouse E2E ${timestamp}`;
    const stockInicial = 5;
    const stockMinimo = 6;
    const cantidadIn = 4;  // Stock tras IN: 9
    const cantidadOut = 4; // M < 9 -> Stock final esperado: 5 (<= mínimo 6)
    const stockFinalEsperado = stockInicial + cantidadIn - cantidadOut;

    // 1) Login como administrador
    await page.goto('/');
    await page.getByLabel('Usuario').fill('admin');
    await page.getByLabel('Contraseña').fill('Admin123!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.locator('#app-view')).toBeVisible();

    // 2) Abrir modal "+ Producto" y crear producto con SKU único
    await page.getByRole('button', { name: '+ Producto' }).click();
    const productDialog = page.locator('#product-dialog');
    await expect(productDialog).toBeVisible();

    await productDialog.getByLabel('SKU').fill(sku);
    await productDialog.getByLabel('Nombre').fill(nombreProducto);
    await productDialog.getByLabel('Categoría').fill('Periféricos');
    await productDialog.getByLabel('Precio (COP)').fill('45000');
    await productDialog.getByLabel('Stock inicial').fill(String(stockInicial));
    await productDialog.getByLabel('Stock mínimo').fill(String(stockMinimo));
    await productDialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(productDialog).toBeHidden();

    // Verificar que el producto creado aparece en la vista Productos
    await page.getByRole('button', { name: 'Productos' }).click();
    const filaProducto = page.locator('#products-table tr', { hasText: sku });
    await expect(filaProducto).toBeVisible();

    // 3) Registrar movimiento IN de N unidades
    await page.getByRole('button', { name: '+ Movimiento' }).click();
    const movementDialog = page.locator('#movement-dialog');
    await expect(movementDialog).toBeVisible();

    // Buscar el value de la opción por SKU o Nombre dentro del select #m-product
    const opcionIn = movementDialog.locator('#m-product option', {
      hasText: new RegExp(`${sku}|${nombreProducto}`),
    }).first();
    await expect(opcionIn).toBeAttached();
    const productValue = await opcionIn.getAttribute('value');

    await movementDialog.getByLabel('Producto').selectOption(productValue!);
    await movementDialog.getByLabel('Tipo').selectOption('IN');
    await movementDialog.getByLabel('Cantidad').fill(String(cantidadIn));
    await movementDialog.getByLabel('Motivo').fill('Ingreso E2E Playwright');
    await movementDialog.getByRole('button', { name: 'Registrar' }).click();
    await expect(movementDialog).toBeHidden();

    // 4) Registrar movimiento OUT de M unidades (M < stock resultante)
    await page.getByRole('button', { name: '+ Movimiento' }).click();
    await expect(movementDialog).toBeVisible();

    await movementDialog.getByLabel('Producto').selectOption(productValue!);
    await movementDialog.getByLabel('Tipo').selectOption('OUT');
    await movementDialog.getByLabel('Cantidad').fill(String(cantidadOut));
    await movementDialog.getByLabel('Motivo').fill('Salida E2E Playwright');
    await movementDialog.getByRole('button', { name: 'Registrar' }).click();
    await expect(movementDialog).toBeHidden();

    // 5) Verificar en Productos que el stock mostrado coincide con el esperado (5)
    await page.getByRole('button', { name: 'Productos' }).click();
    const filaActualizada = page.locator('#products-table tr', { hasText: sku });
    await expect(filaActualizada).toBeVisible();
    await expect(filaActualizada).toContainText(String(stockFinalEsperado));

    // 6) Como stockFinalEsperado (5) <= stockMinimo (6), verificar que aparece en Alertas stock
    await page.getByRole('button', { name: 'Alertas stock' }).click();
    await expect(page.locator('#alerts-table')).toContainText(sku);
  });
});
