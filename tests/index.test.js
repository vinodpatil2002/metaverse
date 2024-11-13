const axios = require("axios");

function sum(a, b) {
    return a + b;
}

const BACKEND_URL = "https://localhost:3000";

// descibe blocks

describe("Authentication", () => {
    test("user is able to signup only once", async () => {
        const username = "vinod" + Math.random();
        const password = "jusun";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin",
        });
        expect(response.statusCode).toBe(200);

        const updatedResponse = await axios.post(
            `${BACKEND_URL}/api/v1/signup`,
            {
                username,
                password,
                type: "admin",
            }
        );

        expect(updatedResponse.statusCode).toBe(400);
    });

    test("Signup request fails if the username is empty", async () => {
        const username = `vinod-${Math.random()}`;
        const password = 123456;

        const response = axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password,
        });
        expect(response.statusCode).toBe(400);
    });

    test("signin succeeds if the username and password are correct", async () => {
        const username = `vinod-${Math.random()}`;
        const password = 123456;

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
        });
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test("signin fails if the username and password are incorrect", async () => {
        const username = `vinod-${Math.random()}`;
        const password = 123456;

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
        });

        const response = await axios.post(
            `${BACKEND_URL}/api/v1/signin`,
            async () => {
                username: "wrong";
                password;
            }
        );

        expect(response.statusCode).toBe(403);
    });
});

describe("User Information endpoints", () => {
    let token = "";
    beforeAll(async () => {
        const username = `vinod-${Math.random()}`;
        const password = 123456;
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin",
        });
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/signin`,
            async () => {
                username, password;
            }
        );

        token = response.body.token;
    });

    test1("test1", () => {});
    test1("test1", () => {});
    test1("test1", () => {});
});
