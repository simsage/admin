import { createGlobalStyle} from "styled-components"
import { createMuiTheme } from "@material-ui/core";

export const lightTheme = createMuiTheme({
    spacing: 4,
    palette: {
        primary: {
            light: '#62C2D6',
            main: '#62C2D6',
            dark: '#62C2D6',
        },
        secondary: {
            light: '#51B274',
            main: '#51B274',
            dark: '#51B274',
        }
    },
});

export const darkTheme = createMuiTheme({
    spacing: 4,
    overrides: {
        MuiInput: {
            input: { color: '#e0e0e0'},
        },
        MuiInputBase: {
            input: { color: '#e0e0e0' },
        },
        MuiInputLabel: {
            root: { color: '#e0e0e0'},
        },
        MuiSelect: {
            root: {
                color: '#808080',
            },
            icon: {
                color: '#808080',
            }
        },
        MuiCheckbox: {
            root: {
                color: '#808080',
            },
        },
        MuiNativeSelect: {
            root: { color: '#000'},
        },
        MuiSlider: {
            markLabel: { color: '#a0a0a0' },
            markLabelActive: { color: '#e0e0e0' }
        },
    },
    palette: {
        primary: {
            light: '#62C2D6',
            main: '#62C2D6',
            dark: '#62C2D6',
        },
        secondary: {
            light: '#9ACA93',
            main: '#9ACA93',
            dark: '#9ACA93',
        }
    },
});


export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
  }
`
