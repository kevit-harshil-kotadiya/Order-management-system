export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.ts'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testTimeout: 30000,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  }
};
