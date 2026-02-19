import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],

  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  modulePaths:["<rootDir>"]
};

export default config;
