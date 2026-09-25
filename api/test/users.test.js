const request = require("supertest");
const app = require("../app");

describe("Users API", () => {
    test("GET /users returns paginated list of users", async () => {
        const response = await request(app)
        .get("/users")
        .query({ limit: 3 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body).toHaveProperty("nextCursor");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeLessThanOrEqual(3);
    });

    test("Get /users rejects a negative limit", async () => {
        const response = await request(app)
        .get("/users")
        .query({ limit: -5 });

        expect(response.status).toBe(400);
    });
});