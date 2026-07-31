import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Recharts ResponsiveContainer needs real layout, which jsdom cannot provide.
// Render its children directly so chart components are testable in jsdom.
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});
