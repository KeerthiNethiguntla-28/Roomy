import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import Post from "../app/models/post.js";
import { updatePost, deletePost } from "../app/services/post-service.js";
import { getUserContext } from "../app/controllers/user-controller.js";
import AdminUserRouter from "../app/routes/admin-user-routes.js";
import { setResponseWithError } from "../app/controllers/response-handler.js";

test("listing writes enforce ownership and do not claim success for absent matches", async (t) => {
  const owner = "owner-a";
  t.mock.method(Post, "updateOne", async (filter, fields, options) => {
    assert.deepEqual(filter, { _id: "listing-b", user: owner });
    assert.equal(options.runValidators, true);
    return { matchedCount: 0 };
  });
  await assert.rejects(updatePost("listing-b", { price: 100 }, owner), {
    status: 404,
  });
  t.mock.method(Post, "deleteOne", async (filter) => {
    assert.deepEqual(filter, { _id: "listing-b", user: owner });
    return { deletedCount: 0 };
  });
  await assert.rejects(deletePost("listing-b", owner), { status: 404 });
});

test("user context never serializes password hashes", async () => {
  let body;
  const res = {
    status() {
      return this;
    },
    json(value) {
      body = value;
    },
  };
  await getUserContext(
    { user: { _id: "a", name: "A", email: "a@example.com", password: "hash" } },
    res,
  );
  assert.equal(body.email, "a@example.com");
  assert.equal("password" in body, false);
});

test("public admin registration returns 404", async () => {
  const app = express();
  app.use("/admin-users", AdminUserRouter);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    const res = await fetch(
      `http://127.0.0.1:${server.address().port}/admin-users/register`,
      { method: "POST" },
    );
    assert.equal(res.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("server errors do not expose implementation details", () => {
  let body, status;
  setResponseWithError(
    {
      status(value) {
        status = value;
        return this;
      },
      json(value) {
        body = value;
      },
    },
    new Error("private database detail"),
  );
  assert.equal(status, 500);
  assert.deepEqual(body, {
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
});
