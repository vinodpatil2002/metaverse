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

describe("User metadata endpoint", () => {
    let token = "";
    let avatarID = "";
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
        const avatarResponse = await axios.post(
            `${BACKEND_URL}/api/v1/admin/avatar`,
            {
                imageUrl:
                    "https://imgs.search.brave.com/4IpvuncRGbAjT61ftqMWVqqXMXyXJCY_nROtazb0H2A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvbWFsZS1ib3kt/Y2hhcmFjdGVyLWF2/YXRhci1wcm9maWxl/XzEwOTAzOTQtMTMw/ODExLmpwZz9zaXpl/PTYyNiZleHQ9anBn",
                name: "timmy",
            }
        );
        avatarID = avatarResponse.data.avatarID;
    });

    test("User cant update metadata with a wrong avatar id", async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/user/metadata`,
            {
                avatarID: "121432423",
            },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
        expect(response).toBe(400);
    });
    test("User can update metadata with the right avatar id", async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/user/metadata`,
            {
                avatarID,
            },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
        expect(response).toBe(200);
    });
    test("User is not able to update metadata if the auth header is not present", async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/user/metadata`,
            {
                avatarID,
            },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
        expect(response).toBe(403);
    });
});

describe("User avatar information", () => {
    let avatarID;
    let token;
    let userId;

    beforeAll(async () => {
        const username = `vinod-${Math.random()}`;
        const password = 123456;
        const signupResponse = await axios.post(
            `${BACKEND_URL}/api/v1/signup`,
            {
                username,
                password,
                type: "admin",
            }
        );

        userId = signupResponse.data.userId;
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/signin`,
            async () => {
                username, password;
            }
        );

        token = response.body.token;
        const avatarResponse = await axios.post(
            `${BACKEND_URL}/api/v1/admin/avatar`,
            {
                imageUrl:
                    "https://imgs.search.brave.com/4IpvuncRGbAjT61ftqMWVqqXMXyXJCY_nROtazb0H2A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvbWFsZS1ib3kt/Y2hhcmFjdGVyLWF2/YXRhci1wcm9maWxl/XzEwOTAzOTQtMTMw/ODExLmpwZz9zaXpl/PTYyNiZleHQ9anBn",
                name: "timmy",
            }
        );
        avatarID = avatarResponse.data.avatarID;
    });

    test("Get back avatar information for the user", async () => {
        const avatar = axios.get(
            `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
        );
        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);
    });

    test("Available avatars lists the recently created avatar", async () => {
        const response = axios.get(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0);
        const currentAvatar = response.data.avatars.find(
            (x) => x.id == avatarID
        );
        expect(currentAvatar).toBeDefined();
    });
});
