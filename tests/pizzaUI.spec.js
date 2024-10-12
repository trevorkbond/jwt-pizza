import { test, expect } from "playwright-test-coverage";

const mockMenuEndpoint = async (page) => {
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 2,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });
};

const mockOrderHistoryEndpoint = async (page) => {
  await page.route("*/**/api/order", async (route) => {
    const orderRes = {
      dinerId: 4,
      orders: [
        {
          id: 1,
          franchiseId: 1,
          storeId: 1,
          date: "2024-06-05T05:14:40.000Z",
          items: [
            {
              id: 1,
              menuId: 1,
              description: "Veggie",
              price: 0.05,
            },
          ],
        },
      ],
      page: 1,
    };
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: orderRes });
  });
};

const mockGetFranchiseEndpoint = async (page) => {
  await page.route("*/**/api/franchise", async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: "LotaPizza",
        stores: [
          { id: 4, name: "Lehi" },
          { id: 5, name: "Springville" },
          { id: 6, name: "American Fork" },
        ],
      },
      { id: 3, name: "PizzaCorp", stores: [{ id: 7, name: "Spanish Fork" }] },
      { id: 4, name: "topSpot", stores: [] },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });
};

const mockPostFranchiseEndpoint = async (page) => {
  await page.route("*/**/api/franchise", async (route) => {
    const franchiseReq = {
      stores: [],
      name: "new franchise!",
      admins: [{ email: "a@jwt.com" }],
    };
    const franchiseRes = {
      stores: [],
      name: "new franchise!",
      admins: [
        {
          email: "a@jwt.com",
          id: 1,
          name: "常用名字",
        },
      ],
      id: 191,
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
    await route.fulfill({ json: franchiseRes });
  });
};

const mockPostStoreEndpoint = async (page) => {
  await page.route("*/**/api/franchise/1/store", async (route) => {
    const storeReq = {
      name: "Taco Bell",
    };
    const storeRes = {
      id: 1,
      name: "Taco Bell",
      franchiseId: 1,
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    await route.fulfill({ json: storeRes });
  });
};

const mockGetFranchiseAdminEndpoint = async (page) => {
  await page.route("*/**/api/franchise", async (route) => {
    const franchiseRes = [
      {
        id: 1,
        name: "THE Franchise",
        admins: [
          {
            id: 3,
            name: "admin guy",
            email: "a@admin.com",
          },
        ],
        stores: [
          {
            id: 2,
            name: "THE Store",
            totalRevenue: 500,
          },
        ],
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });
};

const mockGetSingleFranchiseAdminEndpoint = async (page) => {
  await page.route("*/**/api/franchise/1", async (route) => {
    const franchiseRes = [
      {
        id: 1,
        name: "new franchise!",
        admins: [
          {
            id: 1,
            name: "常用名字",
            email: "a@jwt.com",
          },
        ],
        stores: [
          {
            id: 1,
            name: "Taco Bell",
            totalRevenue: 0,
          },
        ],
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });
};

const mockDeleteStore = async (page) => {
  await page.route("*/**/api/franchise/1/store/1", async (route) => {
    const franchiseRes = {
      message: "store deleted",
    };
    expect(route.request().method()).toBe("DELETE");
    await route.fulfill({ json: franchiseRes });
  });
};

const mockOrderEndpoint = async (page) => {
  await page.route("*/**/api/order", async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: "Veggie", price: 0.0038 },
        { menuId: 2, description: "Pepperoni", price: 0.0042 },
      ],
      storeId: "4",
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: "Veggie", price: 0.0038 },
          { menuId: 2, description: "Pepperoni", price: 0.0042 },
        ],
        storeId: "4",
        franchiseId: 2,
        id: 23,
      },
      jwt: "eyJpYXQ",
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });
};

const mockAuthEndpoint = async (page) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "d@jwt.com", password: "a" };
    const loginRes = {
      user: {
        id: 3,
        name: "Kai Chen",
        email: "d@jwt.com",
        roles: [{ role: "diner" }],
      },
      token: "abcdef",
    };
    await page.evaluate((userData) => {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
    }, loginRes.user);
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
};

const mockRegister = async (page) => {
  await page.route("*/**/api/auth", async (route) => {
    const registerReq = {
      name: "New guy",
      email: "new@jwt.com",
      password: "new",
    };
    const registerRes = {
      user: {
        id: 4,
        name: "New guy",
        email: "new@jwt.com",
        roles: [{ role: "diner" }],
      },
      token: "abcdef",
    };
    await page.evaluate((userData) => {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
    }, registerRes.user);
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });
};

const mockAuthAdminEndpoint = async (page) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 1,
        name: "常用名字",
        email: "a@jwt.com",
        roles: [
          {
            role: "admin",
          },
        ],
      },
      token: "tokengang",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
};

const mockLogoutEndpoint = async (page) => {
  await page.route("*/**/api/auth", async (route) => {
    const logoutRes = {
      message: "logout successful",
    };
    expect(route.request().method()).toBe("DELETE");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await route.fulfill({ json: logoutRes });
  });
};

async function loginAdmin(page) {
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("Email address").fill("a@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("admin");
  await page.getByPlaceholder("Password").press("Enter");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("purchase with login", async ({ page }) => {
  mockMenuEndpoint(page);
  mockAuthEndpoint(page);
  mockGetFranchiseEndpoint(page);
  mockOrderEndpoint(page);
  // Go to order page
  await page.getByRole("button", { name: "Order now" }).click();

  // Create order
  await expect(page.locator("h2")).toContainText("Awesome is a click away");
  await page.getByRole("combobox").selectOption("4");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 2");
  await page.getByRole("button", { name: "Checkout" }).click();

  // Login
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("d@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  // Pay
  await expect(page.getByRole("main")).toContainText(
    "Send me those 2 pizzas right now!"
  );
  await expect(page.locator("tbody")).toContainText("Veggie");
  await expect(page.locator("tbody")).toContainText("Pepperoni");
  await expect(page.locator("tfoot")).toContainText("0.008 ₿");
  await page.getByRole("button", { name: "Pay now" }).click();

  // Check balance
  await expect(page.getByText("0.008")).toBeVisible();
});

test("go to about and history", async ({ page }) => {
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("heading")).toContainText("Mama Rucci, my my");
});

test("admin create a franchise", async ({ page }) => {
  await mockAuthAdminEndpoint(page);
  await mockGetFranchiseAdminEndpoint(page);
  await loginAdmin(page);
  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByRole("main")).toContainText("Add Franchise");
  await expect(
    page.getByRole("columnheader", { name: "Franchise", exact: true })
  ).toBeVisible();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await expect(page.getByRole("heading")).toContainText("Create franchise");
  await mockPostFranchiseEndpoint(page);
  await page.getByPlaceholder("franchise name").click();
  await page.getByPlaceholder("franchise name").fill("new franchise!");
  await page.getByPlaceholder("franchisee admin email").click();
  await page.getByPlaceholder("franchisee admin email").fill("a@jwt.com");

  // Wait for the POST request to be completed before switching the mock back
  const postResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/franchise") &&
      response.request().method() === "POST"
  );

  await page.getByRole("button", { name: "Create" }).click();
  await postResponsePromise;
  await mockGetFranchiseAdminEndpoint(page);
  await expect(page.getByRole("heading")).toContainText("Mama Ricci's kitchen");
});

test("add a store to a franchise", async ({ page }) => {
  await mockAuthAdminEndpoint(page);
  await mockGetSingleFranchiseAdminEndpoint(page);
  await mockPostStoreEndpoint(page);
  await loginAdmin(page);
  await page.locator("footer").getByRole("link", { name: "Franchise" }).click();
  await expect(page.getByRole("contentinfo")).toContainText("Franchise");
  await expect(page.getByRole("heading")).toContainText("new franchise!");
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByPlaceholder("store name").click();
  await page.getByPlaceholder("store name").fill("Taco Bell");
  await expect(page.getByRole("heading")).toContainText("Create store");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(
    page.locator(
      "span.bg-clip-text.bg-gradient-to-tr.from-orange-600.to-orange-400.text-transparent"
    )
  ).toContainText("new franchise!");
});

test("register a user", async ({ page }) => {
  await mockRegister(page);
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByPlaceholder("Full name").fill("New guy");
  await page.getByPlaceholder("Full name").press("Tab");
  await page.getByPlaceholder("Email address").fill("new@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("new");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByRole("banner").click();
  await expect(page.getByLabel("Global")).toContainText("Ng");
});

test("close store", async ({ page }) => {
  await mockAuthAdminEndpoint(page);
  await mockGetSingleFranchiseAdminEndpoint(page);
  await mockDeleteStore(page);
  await loginAdmin(page);
  await page.locator("footer").getByRole("link", { name: "Franchise" }).click();
  await expect(page.getByRole("contentinfo")).toContainText("Franchise");
  await expect(page.getByRole("heading")).toContainText("new franchise!");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("main")).toContainText("new franchise!");
  await expect(page.getByRole("main")).toContainText("store");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(
    page.locator(
      "span.bg-clip-text.bg-gradient-to-tr.from-orange-600.to-orange-400.text-transparent"
    )
  ).toContainText("new franchise!");
});

test("logout", async ({ page }) => {
  await mockAuthAdminEndpoint(page);
  await loginAdmin(page);
  // Wait for the POST request to be completed before switching the mock back
  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/auth") && response.request().method() === "PUT"
  );
  await loginResponsePromise;
  await mockLogoutEndpoint(page);
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByText("Login")).toBeVisible();
});

test("order history", async ({ page }) => {
  await mockAuthAdminEndpoint(page);
  await loginAdmin(page);
  await mockOrderHistoryEndpoint(page);
  await page.getByRole("link", { name: "常" }).click();
  await expect(page.getByRole("heading")).toContainText("Your pizza kitchen");
});

test("docs", async ({ page }) => {
  await page.goto("/docs");
  await expect(
    page.locator(
      "span.bg-clip-text.bg-gradient-to-tr.from-orange-600.to-orange-400.text-transparent"
    )
  ).toContainText("JWT Pizza API");
});
