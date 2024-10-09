import { test, expect } from "playwright-test-coverage";
import { mockedUsers } from "./mockedUsers";

test("home page", async ({ page }) => {
  await page.goto("/");

  expect(await page.title()).toBe("JWT Pizza");
});

// TODO: create standard set of mocked requests

async function mockAuthEndpoint(page, user) {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = user.loginReq;
    const loginRes = user.loginRes;
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
}

async function testLogin(page, user) {
  await mockAuthEndpoint(page, user);

  await page.goto("/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("Email address").fill(user.loginReq.email);
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill(user.loginReq.password);
  await page.getByPlaceholder("Password").press("Enter");
  await expect(
    page.getByRole("link", { name: user.profileInitials, exact: true })
  ).toBeVisible();
  await page
    .getByRole("link", { name: user.profileInitials, exact: true })
    .click();
  await expect(page.getByRole("main")).toContainText(user.loginReq.email);
  await expect(page.getByRole("main")).toContainText(
    user.loginRes.user.roles[0].role
  );
}

test("login with diner user", async ({ page }) => {
  await testLogin(page, mockedUsers.diner);
});

test("login with admin user", async ({ page }) => {
  await testLogin(page, mockedUsers.admin);
});
