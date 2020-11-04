import typescript from "rollup-plugin-typescript"
import { terser } from 'rollup-plugin-terser';
const fileName = process.env.NODE_ENV === 'production' ? "sdk.min" : "sdk"
const config = {
  input: "./src/main.ts",
  output: [
    {
      name: "bangleSdk",
      format: "umd",
      file: `dist/${fileName}.js`,
    },
    {
      name: "bangleSdk",
      format: "es",
      file: `es/${fileName}.js`,
    },
    {
      name: "bangleSdk",
      format: "cjs",
      file: `lib/${fileName}.js`,
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