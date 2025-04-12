import lineClamp from "@tailwindcss/line-clamp";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust this to match your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(lineClamp.handler), // Add the plugin here
  ],
};

export default config;
