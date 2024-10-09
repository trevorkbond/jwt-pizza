import { test, expect } from "playwright-test-coverage";
import { mockedUsers } from "./mockedUsers";

// TODO: create standard set of mocked requests

export async function mockAuthEndpoint(page, user) {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = user.loginReq;
    const loginRes = user.loginRes;

    if (user === mockedUsers.fakeUser) {
      await route.fulfill({
        status: 404,
        json: { code: 404, message: "unknown user" },
      });
      return;
    }

    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
}

async function testLogin(page, user) {
  await mockAuthEndpoint(page, user);
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

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("login with diner user", async ({ page }) => {
  await testLogin(page, mockedUsers.diner);
});

test("login with admin user", async ({ page }) => {
  await testLogin(page, mockedUsers.admin);
});

test("login failure", async ({ page }) => {
  await mockAuthEndpoint(page, mockedUsers.fakeUser);
  const user = mockedUsers.fakeUser;
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("Email address").fill(user.loginReq.email);
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill(user.loginReq.password);
  await page.getByPlaceholder("Password").press("Enter");
  await expect(page.getByRole("main")).toContainText(
    '{"code":404,"message":"unknown user"}'
  );
});
