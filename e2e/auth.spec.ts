import { test, expect } from '@playwright/test'

/**
 * 认证相关 E2E 测试
 * @description 测试登录、注册等认证流程
 */

test.describe('认证流程', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前导航到登录页
    await page.goto('/login')
  })

  test('登录页面应该正确显示', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/登录/)

    // 验证登录表单元素存在
    await expect(page.getByPlaceholder(/邮箱/i)).toBeVisible()
    await expect(page.getByPlaceholder(/密码/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /登录/i })).toBeVisible()
  })

  test('空表单提交应该显示错误提示', async ({ page }) => {
    // 点击登录按钮
    await page.getByRole('button', { name: /登录/i }).click()

    // 验证错误提示
    await expect(page.getByText(/请输入邮箱/i)).toBeVisible()
    await expect(page.getByText(/请输入密码/i)).toBeVisible()
  })

  test('无效邮箱格式应该显示错误', async ({ page }) => {
    // 输入无效邮箱
    await page.getByPlaceholder(/邮箱/i).fill('invalid-email')
    await page.getByPlaceholder(/密码/i).fill('password123')

    // 点击登录按钮
    await page.getByRole('button', { name: /登录/i }).click()

    // 验证邮箱格式错误提示
    await expect(page.getByText(/邮箱格式不正确/i)).toBeVisible()
  })

  test('错误密码应该显示登录失败', async ({ page }) => {
    // 输入测试账号
    await page.getByPlaceholder(/邮箱/i).fill('test@example.com')
    await page.getByPlaceholder(/密码/i).fill('wrongpassword')

    // 点击登录按钮
    await page.getByRole('button', { name: /登录/i }).click()

    // 等待错误提示
    await expect(page.getByText(/邮箱或密码错误/i)).toBeVisible()
  })

  test('成功登录后应该跳转到首页', async ({ page }) => {
    // 注意：这里需要使用有效的测试账号
    // 或者 mock API 响应
    await page.route('**/api/user/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 200,
          message: '登录成功',
          data: {
            token: 'test-token',
            userInfo: {
              id: '1',
              username: '测试用户',
              email: 'test@example.com',
              avatar: '',
              role: 'USER',
              stats: { likes: 0, followers: 0, following: 0 }
            }
          }
        })
      })
    })

    // 输入测试账号
    await page.getByPlaceholder(/邮箱/i).fill('test@example.com')
    await page.getByPlaceholder(/密码/i).fill('correctpassword')

    // 点击登录按钮
    await page.getByRole('button', { name: /登录/i }).click()

    // 验证跳转到首页
    await expect(page).toHaveURL('/')

    // 验证用户信息显示
    await expect(page.getByText('测试用户')).toBeVisible()
  })

  test('未登录用户访问受保护页面应该重定向到登录页', async ({ page }) => {
    // 尝试访问需要登录的页面
    await page.goto('/profile')

    // 验证重定向到登录页
    await expect(page).toHaveURL(/\/login/)

    // 验证有重定向参数
    await expect(page).toHaveURL(/redirect=.*profile/)
  })
})
