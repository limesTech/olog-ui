import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  server: {
    // host: "0.0.0.0",
    port: 3000,
    open: false,
    allowedHosts: [
      "mesalogger.mesa.kph",
      "localhost"
    ],
    // cors: true
    // hmr: {
    //   host: "localhost"
    // }
  },
  build: {
    outDir: "build",
    emptyOutDir: true
  },
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      src: "/src",
      config: "/src/config",
      components: "/src/components",
      views: "/src/views",
      hooks: "/src/hooks",
      providers: "/src/providers",
      features: "/src/features",
      api: "/src/api",
      lib: "/src/lib",
      mocks: "/src/mocks",
      stories: "/src/stories",
      "test-utils": "/src/test-utils"
    }
  },
  test: {
    setupFiles: "./src/setupTests.ts",
    environment: "jsdom",
    coverage: {
      reporter: ["lcov", "text"]
    },
    outputFile: "coverage/sonar-report.xml"
  }
});
