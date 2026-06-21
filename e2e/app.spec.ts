import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com'
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123456'

test.describe('App E2E: flujo principal', () => {
  test('usuario puede iniciar sesion, crear un proyecto y verlo en el dashboard', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('h1')).toContainText(/iniciar|login|acceder/i)

    await page.fill('input[name="email"]', TEST_EMAIL)
    await page.fill('input[name="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/dashboard/)

    await page.goto('/polls/create')
    await expect(page.locator('h1')).toContainText(/crear|nuev/i)

    const pollTitle = `Proyecto E2E ${Date.now()}`
    await page.fill('input[name="title"]', pollTitle)
    await page.fill('textarea[name="description"]', 'Descripcion de prueba automatizada')
    await page.fill('input[name="options"]', 'Tarea 1, Tarea 2, Tarea 3')
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/polls\//, { timeout: 10000 })
    await expect(page.locator('h1')).toContainText(pollTitle)
  })
})
