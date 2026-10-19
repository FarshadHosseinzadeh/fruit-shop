import { describe, expect, it } from "vitest";
import { nextStatus } from "./orderStatus";

describe("nextStatus", () => {
  it("moves one step forward", () => {
    expect(nextStatus("PENDING")).toBe("PREPARING");
    expect(nextStatus("PREPARING")).toBe("ON_THE_WAY");
    expect(nextStatus("ON_THE_WAY")).toBe("DELIVERED");
  });

  it("has no step after delivered", () => {
    expect(nextStatus("DELIVERED")).toBeNull();
  });

  it("never advances a cancelled or unknown order", () => {
    expect(nextStatus("CANCELLED")).toBeNull();
    expect(nextStatus("???")).toBeNull();
  });
});
