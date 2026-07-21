import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette:{

        mode:"light",

        primary:{
            main:"#2563EB"
        },

        secondary:{
            main:"#4F46E5"
        },

        success:{
            main:"#22C55E"
        },

        warning:{
            main:"#F59E0B"
        },

        error:{
            main:"#EF4444"
        },

        background:{
            default:"#F5F7FA",
            paper:"#FFFFFF"
        }

    },

    typography:{

        fontFamily:[
            "Inter",
            "Roboto",
            "Arial",
            "sans-serif"
        ].join(","),

        h3:{
            fontWeight:700
        },

        h4:{
            fontWeight:700
        },

        h5:{
            fontWeight:600
        },

        button:{
            textTransform:"none",
            fontWeight:600
        }

    },

    shape:{
        borderRadius:16
    },

    components:{

        MuiCard:{
            styleOverrides:{
                root:{
                    borderRadius:20,
                    boxShadow:"0 12px 40px rgba(0,0,0,.08)"
                }
            }
        },

        MuiButton:{
            styleOverrides:{
                root:{
                    borderRadius:12,
                    padding:"12px 20px"
                }
            }
        },

        MuiTextField:{
            defaultProps:{
                variant:"outlined",
                fullWidth:true
            }
        }

    }

});

export default theme;