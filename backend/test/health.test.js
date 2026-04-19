const request = require("supertest");
const express = require("express");

// import your app if you export it, else create a tiny app for test
const app = express();
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

describe("GET /api/health", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
