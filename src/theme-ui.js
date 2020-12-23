import {createMuiTheme} from '@material-ui/core/styles';
import deepOrange from "@material-ui/core/colors/deepOrange";
import blueGrey from "@material-ui/core/colors/blueGrey";

const uiTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            light: deepOrange[200],
            main: deepOrange[600],
            dark: deepOrange[750]
        },
        secondary: {
            light: blueGrey[300],
            main: blueGrey[500],
            dark: blueGrey[700]
        }
    },
});

export default uiTheme;
