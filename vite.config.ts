import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    server: { port: 3000 },
    preview: { port: 3000 },
    test: {
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
    },
});
