/** @type {import('jest').Config} */
export default {
  // Use jsdom for browser-like environment
  testEnvironment: "jsdom",

  // Setup files to run after jest is initialized
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],

  // Module name mapping for path aliases and static assets
  moduleNameMapper: {
    // Handle CSS imports
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Handle image imports
    "\\.(jpg|jpeg|png|gif|webp|svg)$":
      "<rootDir>/src/test/__mocks__/fileMock.ts",
  },

  // Transform files with ts-jest
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          module: "ESNext",
          moduleResolution: "Node",
        },
      },
    ],
  },

  // File extensions to consider
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Test file patterns
  testMatch: [
    "<rootDir>/src/**/*.test.{ts,tsx}",
    "<rootDir>/src/**/*.spec.{ts,tsx}",
  ],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/test/**/*",
  ],

  // Coverage thresholds (adjust as needed)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Use ESM
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};
