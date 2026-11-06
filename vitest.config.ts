import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    // Isolated threads avoid Windows fork teardown failures in the full suite.
    pool: 'threads',
    maxWorkers: 1,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
