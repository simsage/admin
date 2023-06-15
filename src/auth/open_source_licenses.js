import React, {Component} from 'react';


import ErrorDialog from '../common/error-dialog';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";


export class OpenSourceLicenses extends Component {
    constructor(props){
        super(props);
        this.state={
            error_title: '',
            error_msg: '',
            has_error: false,  // error trapping
        }
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    render() {
        if (this.state.has_error) {
            return <h1>license: Something went wrong.</h1>;
        }
        return (
            <div>
                <ErrorDialog title={this.state.error_title}
                             theme={this.props.theme}
                             message={this.state.error_msg}
                             callback={this.closeError.bind(this)} />

                 <div className="license-container no-select">

                     <div className="license-section">
                         <div className="title">Apache ActiveMQ</div>
                         <div className="copyright">Copyright © 2005-2019 The Apache Software Foundation </div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache Avro</div>
                         <div className="copyright">Copyright © 2010-2019 The Apache Software Foundation </div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache Cassandra</div>
                         <div className="copyright">Copyright © 2009-2021 The Apache Software Foundation </div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache Hadoop</div>
                         <div className="copyright">Copyright © 2019 The Apache Software Foundation </div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache http-client</div>
                         <div className="copyright">Copyright © 1999-2007 The Apache Software Foundation</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache http-mime</div>
                         <div className="copyright">Copyright © 1999-2020 The Apache Software Foundation</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache Parquet</div>
                         <div className="copyright">Copyright © 2020 The Apache Software Foundation </div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache PDFBox</div>
                         <div className="copyright">Copyright © 2020 The Apache Software Foundation </div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache Spark</div>
                         <div className="copyright">Copyright © 2014- The Apache Software Foundation </div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Apache Tika</div>
                         <div className="copyright">Copyright © 2020 The Apache Software Foundation</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">commons-io</div>
                         <div className="copyright">Copyright © 2002-2020 The Apache Software Foundation</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">commons-fileupload</div>
                         <div className="copyright">Copyright © 2002-2020 The Apache Software Foundation</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">DataStax Driver</div>
                         <div className="copyright">Copyright © DataStax, Inc.</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Google API</div>
                         <div className="copyright">Copyright © 2012 Google Inc.</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Google Drive</div>
                         <div className="copyright">Copyright © 2018, Google Inc.</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Google OAuth</div>
                         <div className="copyright">Copyright © 2018, Google Inc.</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Jackson</div>
                         <div className="copyright">Copyright © 2007- Tatu Saloranta, tatu.saloranta@iki.fi</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">javax-mail</div>
                         <div className="copyright">Copyright © 1997-2011 Oracle and/or its affiliates.</div>
                         <div className="license">CDDL 1.1</div>
                     </div>

                     <div className="license-section">
                         <div className="title">javax WebSocket Client</div>
                         <div className="copyright">Copyright © 2012-2014 Oracle and/or its affiliates. </div>
                         <div className="license">CDDL 1.1, GPL 2.0</div>
                     </div>

                     <div className="license-section">
                         <div className="title">jBcrypt</div>
                         <div className="copyright">Copyright © 2006 Damien Miller &lt;djm@mindrot.org&gt;</div>
                         <div className="license">Mozilla public license 2.0</div>
                     </div>

                     <div className="license-section">
                         <div className="title">JCIFS-ng</div>
                         <div className="copyright">Copyright © 2016 AgNO3 Gmbh & Co. KG</div>
                         <div className="license">GNU Lesser General public license 2.1</div>
                     </div>

                     <div className="license-section">
                         <div className="title">JEP</div>
                         <div className="copyright">Copyright (c) 2004 - 2020 JEP AUTHORS</div>
                         <div className="license">zlib/libpng License</div>
                     </div>

                     <div className="license-section">
                         <div className="title">JNA</div>
                         <div className="copyright">Copyright © 2011 Timothy Wall</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">JEP</div>
                         <div className="copyright">Copyright © 2004 - 2020 JEP AUTHORS</div>
                         <div className="license">zlib/libpng License</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Joda-time</div>
                         <div className="copyright">Copyright © 2001-2005 Stephen Colebourne</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">jSoup</div>
                         <div className="copyright">Copyright © 2009 - 2021 Jonathan Hedley (https://jsoup.org/)</div>
                         <div className="license">MIT License</div>
                     </div>

                     <div className="license-section">
                         <div className="title">junit</div>
                         <div className="copyright">Copyright © 2002-2020 JUnit</div>
                         <div className="license">Eclipse Public License 1.0</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Kotlin</div>
                         <div className="copyright">Copyright © 2016-2020 JetBrains s.r.o.</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                        <div className="title">Kotlin Coroutines Core</div>
                        <div className="copyright">Copyright © 2016-2020 JetBrains s.r.o.</div>
                        <div className="license">Apache 2.0 license</div>
                    </div>

                     <div className="license-section">
                         <div className="title">Microsoft SQL JDBC</div>
                         <div className="copyright">Copyright © 2020 Microsoft Corporation</div>
                         <div className="license">MIT license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Microsoft msal4j</div>
                         <div className="copyright">Copyright © 2020 Microsoft Corporation</div>
                         <div className="license">MIT license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">MariaDB JDBC</div>
                         <div className="copyright">Copyright © 2021, MariaDB</div>
                         <div className="license">LGPL 2.1</div>
                     </div>

                     <div className="license-section">
                         <div className="title">OpenJDK 11.0.9.1</div>
                         <div className="copyright">Copyright © 1995, 2021, Oracle and/or its affiliates.</div>
                         <div className="license">GPLv2 with linking exception</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Postgres SQL JDBC</div>
                         <div className="copyright">Copyright © 1997, PostgreSQL Global Development Group</div>
                         <div className="license">BSD-2 Clause</div>
                     </div>

                     <div className="license-section">
                         <div className="title">snakeyaml</div>
                         <div className="copyright">Copyright © 2008-2013 Andrey Somov</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">snappy java</div>
                         <div className="copyright">Copyright © 2011 Taro L. Saito</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">spaCy</div>
                         <div className="copyright">Copyright © 2016-2020 ExplosionAI GmbH, 2016 spaCy GmbH, 2015 Matthew Honnibal</div>
                         <div className="license">MIT license</div>
                     </div>

                     <div className="license-section">
                        <div className="title">Spring</div>
                        <div className="copyright">Copyright © 2002-2021 Pivotal, Inc.</div>
                        <div className="license">Apache 2.0 license</div>
                    </div>

                    <div className="license-section">
                        <div className="title">Tyrus WebSocket Client</div>
                        <div className="copyright">Copyright © 2014-2015 Oracle and/or its affiliates. </div>
                        <div className="license">Eclipse Public License 2.0</div>
                    </div>

                     <div className="license-section">
                         <div className="title">DROID</div>
                         <div className="copyright">Copyright © 2016, The National Archives &lt;pronom@nationalarchives.gov.uk&gt;</div>
                         <div className="license">BSD License for DROID (Digital Record Object Identification)</div>
                     </div>

                     <div className="license-section">
                         <div className="title">BOX java sdk</div>
                         <div className="copyright">Copyright Box</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">BOX java sdk</div>
                         <div className="copyright">Copyright Box</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">msal4j</div>
                         <div className="copyright">Copyright © Microsoft Corporation. All rights reserved.</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">jjwt</div>
                         <div className="copyright">Copyright © 2004, Mikael Grev, MiG InfoCom AB. (base64@miginfocom.com)</div>
                         <div className="license">Apache 2.0 license</div>
                     </div>

                     <div className="license-section">
                         <div className="title">Auth0 Java JWT</div>
                         <div className="copyright">Copyright © 2015 Auth0, Inc. &lt;support@auth0.com&gt; (http://auth0.com)</div>
                         <div className="license">MIT License</div>
                     </div>

                     <div className="license-section">
                         <div className="title">jai image-io binary distribution</div>
                         <div className="copyright">Copyright © 2005 Sun Microsystems , Copyright © 2010-2014 University of Manchester, Copyright © 2015-2018 jai-imageio contributors</div>
                         <div className="license">Apache compatible</div>
                     </div>

                     <br clear="both" />

                     <div className="button-bottom">
                         <button onClick={() => window.location="/"} className="btn btn-primary btn-block">Return to Sign-in</button>
                     </div>

                 </div>

                <br/>
                <br/>

            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        theme: state.appReducer.theme,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(OpenSourceLicenses);

