import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, 'test/react-native-mock.ts'),
      '@react-native-picker/picker': path.resolve(__dirname, 'test/picker-mock.tsx'),
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: [path.resolve(__dirname, 'test/setup.ts')],
  },
});

