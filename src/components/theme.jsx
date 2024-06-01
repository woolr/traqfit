// theme.js
import { createTheme } from "@material-ui/core/styles";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#01173a", // Oxford Blue
    },
    secondary: {
      main: "#16a2dd", // Picton Blue
    },
    info: {
      main: "#cde5ee", // Columbia Blue
    },
    success: {
      main: "#73d333", // SGBUS Green
    },
    warning: {
      main: "#1d6076", // Midnight Green
    },
  },
});

export default customTheme;
