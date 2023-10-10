/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    "left-M",
    "left-T",
    "left-W",
    "left-R",
    "left-F",
    "left-1/2",
    "left-1/3",
    "left-2/3",
    "left-1/4",
    "left-2/4",
    "left-3/4",
    "w-1/2",
    "w-1/3",
    "w-1/4",
    "bg-red-200",
    "bg-orange-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-teal-200",
    "bg-sky-200",
    "bg-indigo-200",
    "bg-purple-200",
    "bg-pink-200",
    "border-red-600",
    "border-orange-600",
    "border-yellow-600",
    "border-green-600",
    "border-teal-600",
    "border-sky-600",
    "border-indigo-600",
    "border-purple-600",
    "border-pink-600"
  ],
  theme: {
    extend: {
      spacing: {
        day: "19%",
      },
      inset: {
        M: "5%",
        T: "24%",
        W: "43%",
        R: "62%",
        F: "81%"
      }
    },
  },
  plugins: [],
}
