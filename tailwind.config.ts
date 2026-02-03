import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist: [
    {
      pattern:
        /text-(heading-1|heading-2|heading-3|heading-4|heading-5|heading-6|body-1|body-2|body-3|body-4|body|title|label-1|label-2|label-3)/,
    },
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        "12px": "0.75rem",
        "14px": "0.875rem",
        "16px": "1rem",
        "18px": "1.125rem",
        "20px": "1.25rem",
        "24px": "1.5rem",
        "28px": "1.75rem",
        "32px": "2rem",
        "36px": "2.25rem",
        "40px": "2.5rem",
        "heading-1": [
          "3.75rem",
          {
            lineHeight: "90px",
            letterSpacing: "0.5px", // 0.01em is 1% of the element font size
          },
        ],
        "heading-2": [
          "3rem",
          {
            lineHeight: "72px",
            letterSpacing: "0.5px",
          },
        ],
        "heading-3": [
          "2.5rem",
          {
            lineHeight: "60px",
            letterSpacing: "0.5px",
          },
        ],
        "heading-4": [
          "2rem",
          {
            lineHeight: "48px",
            letterSpacing: "0.5px",
          },
        ],
        "heading-5": [
          "1.75rem",
          {
            lineHeight: "42px",
            letterSpacing: "0.5px",
          },
        ],
        "heading-6": [
          "1.5rem",
          {
            lineHeight: "36px",
            letterSpacing: "0.5px",
          },
        ],
        "body-1": [
          "1rem",
          {
            lineHeight: "24px",
            letterSpacing: "0.25px",
          },
        ],
        "body-2": [
          "0.875rem",
          {
            lineHeight: "20px",
            letterSpacing: "0.25px",
          },
        ],
        "body-3": [
          "0.875rem",
          {
            lineHeight: "20px",
            letterSpacing: "0.25px",
          },
        ],
        body: [
          "0.75rem",
          {
            lineHeight: "15px",
            letterSpacing: "0.25px",
          },
        ],
        title: [
          "1.125rem",
          {
            lineHeight: "28px",
            letterSpacing: "0.5px",
          },
        ],
        "label-1": [
          "0.875rem",
          {
            lineHeight: "22px",
            letterSpacing: "0.1px",
          },
        ],
        "label-2": [
          "0.75rem",
          {
            lineHeight: "16px",
            letterSpacing: "0.1px",
          },
        ],
        "label-3": [
          "0.625rem",
          {
            lineHeight: "12px",
            letterSpacing: "0.1px",
          },
        ],
        "body-4": [
          "0.875rem",
          {
            lineHeight: "20px",
            letterSpacing: "0.07px",
          },
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"], // jadikan default
        primary: ["Inter", "sans-serif"],
        secondary: ["Albert Sans Variable", "sans-serif"],
        third: ["Alegreya Sans", "sans-serif"],
      },
      fontWeight: {
        hairline: "100",
        thin: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      fontStyle: {
        italic: "italic",
        normal: "normal",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
