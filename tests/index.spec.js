import app from "../src/app";
import request from "supertest";

describe("GET /tasks", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/tasks").send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond with an array", async () => {
    const response = await request(app).get("/tasks").send();
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("POST /tasks", () => {
  describe("given a title and description", () => {
    const newTask = {
      title: "Test Task",
      description: "Test Description",
    };

    test("should respond with a 200 starus code", async () => {
      const response = await request(app).post("/tasks").send(newTask);
      expect(response.statusCode).toBe(200);
    });

    test("should have a content-type: aplication/json in header", async () => {
      const response = await request(app).post("/tasks").send(newTask);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("should respond with an task ID", async () => {
      const response = await request(app).post("/tasks").send(newTask);
      expect(response.body.id).toBeDefined();
    });
  });

  describe("when title and description is missing", () => {
    test("should respond with a 400 status code when title is missing", async () => {
      const response = await request(app).post("/tasks").send({ title: "" });
      expect(response.statusCode).toBe(400);
    });

    test("should respond with a 400 status code when description is missing", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({ description: "" });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("when title or description is missing", () => {
    test("should respond with a 400 status code for various missing fields", async () => {
      const fields = [
        {},
        { title: "Test Task" },
        { description: "Test Description" },
      ];

      for (const body of fields) {
        const response = await request(app).post("/tasks").send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});
