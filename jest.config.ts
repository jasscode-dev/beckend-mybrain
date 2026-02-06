import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],

  moduleNameMapper: {
    "^@repositories$": "<rootDir>/src/modules/routine/repositories/index.ts",
    "^@interfaces$": "<rootDir>/src/modules/routine/repositories/interfaces/index.ts",
    "^@tasks/controllers$": "<rootDir>/src/modules/routine/controllers/index.ts",
    "^@auth/controllers$": "<rootDir>/src/modules/user/controllers/index.ts",
    "^@services$": "<rootDir>/src/modules/routine/services/index.ts",
    "^@entities$": "<rootDir>/src/modules/routine/entities/index.ts",
    "^@presenters$": "<rootDir>/src/modules/routine/presenters/index.ts",
    "^@tasks/schemas$": "<rootDir>/src/modules/routine/validators/index.ts",
    "^@auth/schemas$": "<rootDir>/src/modules/user/validators/index.ts",
    "^@types$": "<rootDir>/src/types/index.ts",
    "^@errors$": "<rootDir>/src/errors/index.ts",
    "^@middlewares$": "<rootDir>/src/middlewares/index.ts",
    "^@lib$": "<rootDir>/src/lib/index.ts",
    "^@prisma$": "<rootDir>/src/lib/prisma.ts",
    "^src/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};

export default config;
