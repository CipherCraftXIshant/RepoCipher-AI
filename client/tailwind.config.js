/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        "bg-dark": "#16171d",
        text: "#6b6375",
        "text-dark": "#9ca3af",
        heading: "#08060d",
        "heading-dark": "#f3f4f6",
        border: "#e5e4e7",
        "border-dark": "#2e303a",
        code: "#f4f3ec",
        "code-dark": "#1f2028",
        accent: "#aa3bff",
        "accent-dark": "#c084fc",
        "accent-bg": "rgb(170 59 255 / 0.1)",
        "accent-bg-dark": "rgb(192 132 252 / 0.15)",
        "accent-border": "rgb(170 59 255 / 0.5)",
        "accent-border-dark": "rgb(192 132 252 / 0.5)",
        danger: "#e5484d",
        good: "#16a34a",
      },
      boxShadow: {
        card: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
        "card-dark": "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -2px rgb(0 0 0 / 0.25)",
        focus: "0 0 0 3px rgb(170 59 255 / 0.1)",
        "focus-dark": "0 0 0 3px rgb(192 132 252 / 0.15)",
      },
      fontFamily: {
        sans: ["system-ui", '"Segoe UI"', "Roboto", "sans-serif"],
        mono: ["ui-monospace", "Consolas", "monospace"],
      },
    },
  },
};
