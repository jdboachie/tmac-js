/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  transform: {},
  injectGlobals: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};

export default config;
