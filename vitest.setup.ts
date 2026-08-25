import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jest-axe ships Jest-flavored types; teach Vitest's matchers about it.
interface AxeMatchers<R = unknown> {
  toHaveNoViolations(): R;
}
declare module "vitest" {
  // Default type param must match jest-dom's own Assertion augmentation.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends AxeMatchers<T> {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

// jsdom is missing ResizeObserver, which useChartDimensions relies on.
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

afterEach(() => {
  cleanup();
});
