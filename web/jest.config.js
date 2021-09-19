module.exports = {
    "roots": [
      "./src"
    ],
    "testMatch": [
      //"**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "setupFilesAfterEnv": ["./src/__tests__/mirageSetup.ts"],
  }