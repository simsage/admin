import React, {Component} from 'react';

import Comms from "../../../common/comms";
import RestoreWPArchive from "../../../common/restore-wp-archive";

import '../../../css/crawler.css';


export class CrawlerWordpress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            organisation_id: props.organisation_id,
            kb_id: props.kb_id,
            source_id: props.source_id,
            onSave: props.onSave,
            onError: props.onError,
        };

    }
    componentWillUnmount() {
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState({
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            });
        }
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            // dummy value in order to save
            this.state.onSave({crawlerType: "wordpress"});
        }
    }
    exportArchive() {
        if (this.props.session && this.props.session.id)
            Comms.download_export_archive(this.state.organisation_id, this.state.kb_id, this.state.source_id, this.props.session.id);
    }
    restore(data) {
        if (data && data.data && data.data.length > 0) {
            // sid will be set by wpUploadArchive
            this.props.wpUploadArchive({"organisationId": this.state.organisation_id,
                "kbId": this.state.kb_id, "sid": "", "sourceId": this.state.source_id, "data": data.data});
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-wordpress.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">
                <div className="wp-form">
                    The WordPress crawler is an external entity controlled by the SimSage WordPress plugin.<br/>
                    As such there are no properties to configure here, nor is there a schedule for SimSage to work to.<br/><br/>

                    {this.state.source_id > 0 &&
                        <div className="export-wp">
                            <div>export the contents of this source as a WordPress GZip Archive</div>
                            <button className="btn btn-primary btn-block"
                                    onClick={() => this.exportArchive()}>Export WordPress Archive</button>
                        </div>
                    }

                    {this.state.source_id > 0 &&
                        <div className="import-wp">
                            <div className="import-text">import the contents of  WordPress GZip Archive into this source</div>
                            <RestoreWPArchive doUpload={(data) => this.restore(data)}
                                              organisationId={this.state.organisation_id}
                                              kbId={this.state.kb_id}
                                              sourceId={this.state.source_id}
                                              onError={(err) => this.props.setError("Error", err)} />
                        </div>
                    }

                </div>
            </div>
        );
    }
}

export default CrawlerWordpress;
