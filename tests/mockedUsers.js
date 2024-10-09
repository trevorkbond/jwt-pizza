export const mockedUsers = {
  diner: {
    loginReq: { email: "d@jwt.com", password: "a" },
    loginRes: {
      user: {
        id: 3,
        name: "Kai Chen",
        email: "d@jwt.com",
        roles: [{ role: "diner" }],
      },
      token: "dinerToken",
    },
    profileInitials: "KC",
  },
  admin: {
    loginReq: { email: "admin@jwt.com", password: "admin" },
    loginRes: {
      user: {
        id: 4,
        name: "Admin Guy",
        email: "admin@jwt.com",
        roles: [{ role: "admin" }],
      },
      token: "adminToken",
    },
    profileInitials: "AG",
  },
  fakeUser: {
    loginReq: { email: "fake@fake.com", password: "fake" },
  },
};
