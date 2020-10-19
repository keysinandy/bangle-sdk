import typescript from "rollup-plugin-typescript"
import { terser } from 'rollup-plugin-terser';
const config = {
  input: "./src/main.ts",
  output: [
    {
      name: "bangleSdk",
      format: "umd",
      file: "lib/bundle.umd.js",
      sourcemap: true
    },
    {
      name: "bangleSdk",
      format: "es",
      file: "lib/bundle.es.js",
      sourcemap: true
    }
  ],
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
  ],
};
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(terser())
}

export default config