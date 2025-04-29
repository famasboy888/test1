export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "json", "node"],
  testMatch: ["**/__test__/**/*.js", "**/__test__/**/*.test.js"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  testTimeout: 10000,
};
