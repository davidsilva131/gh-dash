import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as React from "react";

// Explicit cleanup: RTL only auto-cleans when vitest globals are enabled,
// and this project uses explicit imports.
afterEach(() => {
  cleanup();
});

// Recharts ResponsiveContainer needs real layout, which jsdom cannot provide.
// Mock it to render children at fixed dimensions (the canonical Recharts
// testing pattern) so chart components are testable and deterministic.
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  const MockedResponsiveContainer = ({
    children,
    width = 800,
    height = 400,
  }: {
    children?: React.ReactNode;
    width?: number;
    height?: number;
  }) =>
    React.createElement(
      "div",
      { style: { width, height } },
      React.isValidElement(children)
        ? React.cloneElement(children, { width, height })
        : children
    );
  return { ...actual, ResponsiveContainer: MockedResponsiveContainer };
});
