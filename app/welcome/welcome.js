import React from "react";


export class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="welcome">

                <img src="../images/simsage-logo-white.svg" alt="SimSage logo" className="simsage-logo"/>

                <div className="welcome-box">
                    <div className="welcome-title">
                        Welcome to your SimSage Semantic Search and Bot System!
                    </div>
                </div>

                <div className="welcome-text">
                    This is our welcome package customised for you! We've done our homework and have indexed your
                    web-site using SimSage Semantic Search and pre-loaded one of our bots with some information about
                    your company.
                </div>

                <div className="boxes">

                    <div className="intro-box arrow-right">
                        <br/>
                        Semantic Search
                    </div>

                    <div className="box arrow-right">
                        download your demo SimSage Semantic Search <a href="" id="searchUrl"
                                                                      title="download SimSage Semantic Search">here</a>,
                        we've indexed your website.
                        <div className="number-circle">1</div>
                    </div>

                    <div className="box arrow-right">
                        unzip this file on your hard-drive and open index.html with a browser.
                        <div className="works-best">(SimSage Semantic Search works best with the Mozilla FireFox or
                            Google Chrome browsers)</div>
                        <div className="number-circle">2</div>
                    </div>


                    <div className="box">
                        Start searching your website using SimSage Semantic Search, type in some keywords.
                        <div className="number-circle">3</div>
                    </div>

                </div>

                <br clear="both" />

                <div className="boxes">

                    <div className="intro-box arrow-right">
                        <br/>
                        Bot
                    </div>

                    <div className="box arrow-right">
                        <div className="number-circle">1</div>
                        download your demo SimSage Bot <a href="" id="botUrl" title="download SimSage Bot">here</a>,
                        we've added the following <a href="../resources/sample-spreadsheet.xlsx" id="spreadsheetUrl1"
                                                     title="download your SimSage spreadsheet">spreadsheet</a> for
                        you.
                    </div>

                    <div className="box arrow-right">
                        <div className="number-circle">2</div>
                        unzip this file on your hard-drive and open index.html with a browser.
                        <div className="works-best">(SimSage Bots work best with the Mozilla FireFox or Google
                            Chrome browsers)</div>
                    </div>

                    <div className="box">
                        <div className="number-circle">3</div>
                        Look at the <a href="../resources/sample-spreadsheet.xlsx" id="spreadsheetUrl2"
                                       title="download your SimSage spreadsheet">spreadsheet</a> we've provided for
                        you and ask it some of the questions.
                    </div>

                </div>

                <br clear="both" />

                <div className="next-steps-title">
                    Next steps
                </div>

                <div className="next-steps">

                    <div className="next-step">
                        <div className="next-image-box">
                            <a href="https://github.com/simsage-nz/" target="_blank"
                               title="visit our github page"><img src="../images/github-icon.png" alt="github"
                                                                  className="next-image"/></a>
                        </div>
                        <div className="next-step-text">The html downloads above are open-source and can be
                            found <a href="https://github.com/simsage-nz/" target="_blank"
                                     title="visit our github page">on our github page</a>. Feel free to apply
                            your own styles to them and use them on your own website.
                        </div>
                    </div>

                    <div className="next-step">
                        <div className="next-image-box">
                            <a href="../resources/simsage-user-guide.pdf" id="dlManual1" target="_blank" title="download the SimSage manual"><img
                                src="../images/pdf-icon.png" alt="manual" className="next-image"/></a>
                        </div>
                        <div className="next-step-text">Our comprehensive SimSage manual can be <a href="../resources/simsage-user-guide.pdf"
                                                                                                   id="dlManual2"
                                                                                                   title="download the SimSage manual">downloaded
                            here</a>. Please take some time to review it.
                        </div>
                    </div>

                    <div className="next-step">
                        <div className="next-image-box">
                            <a href="https://www.youtube.com/playlist?list=PLZd5vRACKJ1qFwTtRuSbKwRYGhR2tboB-"
                               target="_blank" title="video SimSage videos"><img src="../images/youtube-icon.png"
                                                                                 alt="videos"
                                                                                 className="next-image"/></a>
                        </div>
                        <div className="next-step-text">We also have videos which can be found <a
                            href="https://www.youtube.com/playlist?list=PLZd5vRACKJ1qFwTtRuSbKwRYGhR2tboB-"
                            target="_blank" title="video SimSage videos">here</a> for taking you through
                            managing SimSage.
                        </div>
                    </div>

                    <div className="next-step">
                        <div className="next-image-box">
                            <a href="/" id="signInUrl1"
                               title="sign-into your SimSage Instance"><img src="../images/login-icon.png"
                                                                            alt="sign-in"
                                                                            className="next-image"/></a>
                        </div>
                        <div className="next-step-text">Sign-in to your own SimSage admin page <a href="/"
                                                                                                  id="signInUrl2"
                                                                                                  target="_blank"
                                                                                                  title="sign-into your SimSage Instance">here</a>.
                            We will send you a password and an account to sign-in with.
                        </div>
                    </div>

                </div>

                <br clear="both" />

                <div className="contact-title">
                    Contact us
                </div>

                <div className="contact-text">
                    Interested in pricing? Partnering with SimSage? More technical information?
                    Please contact Sean Wilson at <a href="mailto:sean@simsage.nz"
                                                     title="send Sean an email"
                                                     target="_blank">sean@simsage.nz</a>, or phone Sean on
                    +44 (0) 7691 801 095
                </div>

                <br/>
                <br/>
                <br/>
                <br/>

            </div>
        )
    }
}

export default(Welcome);
