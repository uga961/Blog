import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSessionToken, verifySessionToken } from "@/lib/session";

describe("Authentication & Session System", () => {
  it("hashes password and verifies successfully with correct password", async () => {
    const raw = "SuperSecretPassword123!";
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

    const isMatch = await verifyPassword(raw, hash);
    expect(isMatch).toBe(true);
  });

  it("fails verification with incorrect password", async () => {
    const hash = await hashPassword("RightPassword");
    const isMatch = await verifyPassword("WrongPassword", hash);
    expect(isMatch).toBe(false);
  });

  it("creates and verifies a signed JWT session token", async () => {
    const payload = {
      userId: "user_abc123",
      email: "admin@xyz.in",
      name: "Alex",
      role: "ADMIN",
    };

    const token = await createSessionToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe(payload.role);
  });

  it("rejects invalid or tampered session token", async () => {
    const fakeToken = "invalid.tampered.token";
    const verified = await verifySessionToken(fakeToken);
    expect(verified).toBeNull();
  });
});
