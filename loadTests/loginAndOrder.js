import { sleep, check, group, fail } from "k6";
import http from "k6/http";

export const options = {
  cloud: {
    distribution: {
      "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
    },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: "ramping-vus",
      gracefulStop: "30s",
      stages: [
        { target: 5, duration: "30s" },
        { target: 15, duration: "1m" },
        { target: 10, duration: "30s" },
        { target: 0, duration: "30s" },
      ],
      gracefulRampDown: "30s",
      exec: "scenario_1",
    },
  },
};

export function scenario_1() {
  let response;

  group("page_1 - https://pizza.trevorbond.click/", function () {
    response = http.get("https://pizza.trevorbond.click/", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "if-modified-since": "Thu, 31 Oct 2024 23:41:41 GMT",
        "if-none-match": '"f93ffe70d4ff68df7c0480d3d45c1e62"',
        priority: "u=0, i",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
    });
    sleep(13.1);

    let authToken;
    response = http.put(
      "https://pizza-service.trevorbond.click/api/auth",
      '{"email":"d@jwt.com","password":"diner"}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.trevorbond.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );
    if (
      !check(response, {
        "Login status equals 200": (response) =>
          response.status.toString() === "200",
      })
    ) {
      console.log(response.body);
      fail("Login was *not* 200");
    }
    function arrayBufferToString(buffer) {
      return new TextDecoder("utf-8").decode(buffer);
    }

    // Handle response body
    let bodyText;
    if (response.body instanceof ArrayBuffer) {
      bodyText = arrayBufferToString(response.body);
    } else {
      bodyText = response.body; // Already a string
    }

    try {
      const responseBody = JSON.parse(bodyText); // Parse the string to JSON
      authToken = responseBody.token; // Extract the token (adjust the key as needed)
    } catch (error) {
      console.error(`Failed to parse JSON response: ${bodyText}`);
      fail("Invalid JSON response from /api/auth");
    }
    sleep(4.2);

    response = http.get(
      "https://pizza-service.trevorbond.click/api/order/menu",
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "if-none-match": 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
          origin: "https://pizza.trevorbond.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );

    response = http.get(
      "https://pizza-service.trevorbond.click/api/franchise",
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.trevorbond.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );
    sleep(14.5);

    response = http.post(
      "https://pizza-service.trevorbond.click/api/order",
      '{"items":[{"menuId":4,"description":"Crusty","price":0.0028}],"storeId":"4","franchiseId":1}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.trevorbond.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (
      !check(response, {
        "Order status equals 200": (response) =>
          response.status.toString() === "200",
      })
    ) {
      console.log(response.body);
      fail("Order was *not* 200");
    }
    // Handle response body
    if (response.body instanceof ArrayBuffer) {
      bodyText = arrayBufferToString(response.body);
    } else {
      bodyText = response.body; // Already a string
    }
    let jwt;
    try {
      const responseBody = JSON.parse(bodyText); // Parse the string to JSON
      jwt = responseBody.jwt; // Extract the token (adjust the key as needed)
    } catch (error) {
      console.error(`Failed to parse JSON response: ${bodyText}`);
      fail("Invalid JSON response from /api/order");
    }
    sleep(4);

    response = http.post(
      "https://pizza-factory.cs329.click/api/order/verify",
      `{"jwt": "${jwt}"}`,
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.trevorbond.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
      }
    );
  });
}
