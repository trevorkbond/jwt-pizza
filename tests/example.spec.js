import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("/");

  expect(await page.title()).toBe("JWT Pizza");
});

test("login", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("Email address").fill("test@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("test");
  await page.getByPlaceholder("Password").press("Enter");
  await expect(
    page.getByRole("link", { name: "t", exact: true })
  ).toBeVisible();
  await page.getByRole("link", { name: "t", exact: true }).click();
  await expect(page.getByRole("main")).toContainText("test@jwt.com");
  await expect(page.getByRole("main")).toContainText("diner");
});
