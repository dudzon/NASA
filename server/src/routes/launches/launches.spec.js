const request = require("supertest");
const app = require("../../app");

const { mongoConnect, disconnect } = require("../../services/mongo");

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe("TEST GET/launches", () => {
    test("It should respond with 200 status success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("TEST POST /launches", () => {
    const launchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      destination: "Kepler-186 f",
      launchDate: "January 4, 2028",
    };
    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      destination: "Kepler-186 f",
    };
    const launchDataWithErrorInDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      destination: "Kepler-186 f",
      launchDate: "whatever",
    };

    test("It should respond with 201 status success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(response.body).toMatchObject(launchDataWithoutDate);
      expect(requestDate).toBe(responseDate);
    });
    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      const error = {
        error: "Missing required launch property",
      };

      expect(response.body).toStrictEqual(error);
    });
    test("It should catch invalid date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithErrorInDate)
        .expect("Content-Type", /json/)
        .expect(400);

      const error = {
        error: "Invalid launch date",
      };

      expect(response.body).toStrictEqual(error);
    });
  });
});
