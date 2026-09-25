const request = require('supertest');
const app = require('../app');

describe("Application API", () => {
    test("GET / returns welcome message", async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Welcome to the DevOps Lab API" });
    });
})
