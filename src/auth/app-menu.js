import React, {Component} from 'react';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/app-menu.css';

export class AppMenu extends Component {
    constructor(props){
        super(props);

        this.state={
            title: props.title,
            signed_in: props.signed_in,
            showDocumentation: window.location.toString().indexOf('/documentation') < 0,
        };
    }
    componentDidMount() {
        if (this.props.theme === 'light') {
            document.getElementById('ss-body').className = 'light';
        } else {
            document.getElementById('ss-body').className = 'dark';
        }
    }
    goWeb() {
        this.props.history.push(window.ENV.web_base);
    }
    signOut() {
        this.props.signOut(() => {
            this.props.history.push("/");
        });
    }
    // get the right logo file depending on the theme
    getLogo() {
        if (this.props.theme === 'dark') {
            return "images/simsage-logo-white-no-strapline.svg";
        }
        return "images/simsage-logo-no-strapline.svg"; // default
    }
    flipTheme() {
        if (this.props.theme !== 'light') {
            this.props.setTheme('light');
            document.getElementById('ss-body').className = 'light';
        } else {
            this.props.setTheme('dark');
            document.getElementById('ss-body').className = 'dark';
        }
    }
    render() {
        const theme = this.props.theme;
        return (
            <div className={"app-menu menu-padding no-select"}>
                <div className="logo-box">
                    <img alt="SimSage" title="Search less; find more." className="logo" src={this.getLogo()} onClick={() => this.goWeb()} />
                </div>
                <div>

                    {
                        !this.state.signed_in &&
                        <span className="home-image-container">
                            <img src={theme === 'light' ? "images/home.svg" : "images/home-light.svg"} alt="home" title="home" onClick={() => this.goWeb()}
                                 className="home-image" />
                             <div className="version-text">version {window.ENV.version}</div>
                        </span>
                    }
                    {
                        this.state.signed_in &&
                        <div className="sign-out-image-container">
                            <img src={theme === 'light' ? "images/sign-out.svg" : "images/sign-out-light.svg"} alt="sign-out" title="sign-out"
                                 onClick={() => { this.signOut() }} className="sign-out-image" />
                        </div>
                    }

                </div>
                <br clear="both" />
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        theme: state.appReducer.theme,
    }
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(AppMenu);
