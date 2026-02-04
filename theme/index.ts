import { extendTheme } from "@chakra-ui/react";

const bauhaus = {
  background: "#151415",
  foreground: "#F1F1F1",
  box: "#1E1D1E",
  smallBox: "#2E1818",
  smallBoxText: "#FF3217",
  black: "#121212",
  orange: "#F97316",
  red: "#F97316",
  blue: "#457B9D",
  yellow: "#030FC6",
  green: "#208040",
  border: "#121212",
};

export const theme = extendTheme({
  colors: {
    bauhaus,
  },
  fontSizes: {
    "2xs": "0.625rem",
  },
  semanticTokens: {
    colors: {
      "text.secondary": { default: "#B0B0B0", _dark: "#B0B0B0" },
      "text.tertiary": { default: "#888888", _dark: "#888888" },
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bg: "bauhaus.red",
          color: "white",
          border: "3px solid",
          borderColor: "bauhaus.black",
          boxShadow: "3px 3px 0px 0px #121212",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "wider",
          _hover: {
            bg: "#ea580c",
            transform: "translateY(-1px)",
            boxShadow: "4px 4px 0px 0px #121212",
          },
          _active: {
            transform: "translate(3px, 3px)",
            boxShadow: "none",
          },
        },
        outline: {
          border: "3px solid",
          borderColor: "bauhaus.black",
          bg: "transparent",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "wider",
          _hover: {
            bg: "bauhaus.yellow",
            borderColor: "bauhaus.black",
            color: "white",
          },
        },
        yellow: {
          bg: "bauhaus.yellow",
          color: "white",
          border: "3px solid",
          borderColor: "bauhaus.black",
          boxShadow: "3px 3px 0px 0px #121212",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "wider",
          _hover: {
            transform: "translateY(-1px)",
            boxShadow: "4px 4px 0px 0px #121212",
          },
          _active: {
            transform: "translate(3px, 3px)",
            boxShadow: "none",
          },
        },
        green: {
          bg: "bauhaus.green",
          color: "white",
          border: "3px solid",
          borderColor: "bauhaus.black",
          boxShadow: "3px 3px 0px 0px #121212",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "wider",
          _hover: {
            transform: "translateY(-1px)",
            boxShadow: "4px 4px 0px 0px #121212",
          },
          _active: {
            transform: "translate(3px, 3px)",
            boxShadow: "none",
          },
        },
      },
    },
  },
});
