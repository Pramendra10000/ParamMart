import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#5B5FEF",
            light: "#7C80FF",
            dark: "#4548C7",
            contrastText: "#FFFFFF"
        },

        secondary: {
            main: "#06B6D4",
            light: "#22D3EE",
            dark: "#0891B2",
            contrastText: "#FFFFFF"
        },

        success: {
            main: "#16A34A"
        },

        warning: {
            main: "#F59E0B"
        },

        error: {
            main: "#DC2626"
        },

        background: {
            default: "#F7F8FC",
            paper: "#FFFFFF"
        },

        text: {
            primary: "#171A2B",
            secondary: "#687086"
        },

        divider: "#E7E9F0"
    },

    typography: {
        fontFamily: [
            "Inter",
            "Roboto",
            "Arial",
            "sans-serif"
        ].join(","),

        h1: {
            fontWeight: 800,
            letterSpacing: "-0.03em"
        },

        h2: {
            fontWeight: 800,
            letterSpacing: "-0.025em"
        },

        h3: {
            fontWeight: 700,
            letterSpacing: "-0.02em"
        },

        h4: {
            fontWeight: 700,
            letterSpacing: "-0.015em"
        },

        h5: {
            fontWeight: 600
        },

        h6: {
            fontWeight: 600
        },

        body1: {
            fontSize: "0.95rem",
            lineHeight: 1.7
        },

        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.6
        },

        button: {
            textTransform: "none",
            fontWeight: 600
        }
    },

    shape: {
        borderRadius: 14
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    margin: 0,
                    backgroundColor: "#F7F8FC"
                },

                "*": {
                    boxSizing: "border-box"
                }
            }
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    border: "1px solid #E7E9F0",
                    boxShadow: "0 10px 35px rgba(23, 26, 43, 0.06)",
                    transition: "all 0.25s ease"
                }
            }
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: "11px 20px",
                    fontWeight: 600,
                    boxShadow: "none",
                    transition: "all 0.25s ease"
                },

                containedPrimary: {
                    "&:hover": {
                        boxShadow: "0 8px 24px rgba(91, 95, 239, 0.25)",
                        transform: "translateY(-1px)"
                    }
                }
            }
        },

        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                fullWidth: true
            }
        },

        MuiOutlinedInput: {
  styleOverrides: {
    root: {
      borderRadius: 14,

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#6366F1",
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderWidth: 2,
        borderColor: "#6366F1",
      },
    },
  },
},
MuiInputLabel: {
  styleOverrides: {
    root: {
      "&.Mui-focused": {
        color: "#4F46E5",
      },
    },
  },
},

        
    }
});

export default theme;