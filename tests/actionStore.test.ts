import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ACTION_STORE_KEY,
  ACTION_STORE_VERSION,
  ACTION_STORE_DEBOUNCE_MS,
} from "../src/actionStore";

test("ACTION_STORE_KEY is zenHnActions", () => {
  assert.equal(ACTION_STORE_KEY, "zenHnActions");
});

test("ACTION_STORE_VERSION is 1", () => {
  assert.equal(ACTION_STORE_VERSION, 1);
});

test("ACTION_STORE_DEBOUNCE_MS is 250", () => {
  assert.equal(ACTION_STORE_DEBOUNCE_MS, 250);
});
