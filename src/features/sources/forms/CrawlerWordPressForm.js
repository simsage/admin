import React, {useEffect} from "react";
import RestoreWPArchive from "../../../common/restore-wp-archive";
import Comms from "../../../common/comms";

export default function CrawlerWordPressForm(props) {


    const selected_source = props.source;

    const specific_json = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const l_form_data = props.form_data;

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])



    function exportArchive() {
        // if (props.session && props.session.id)
            // Comms.download_export_archive(props.organisation_id, state.kb_id, this.state.source_id, this.props.session.id);
    }

    function restore(data) {
        if (data && data.data && data.data.length > 0) {
            // sid will be set by wpUploadArchive
            this.props.wpUploadArchive({"organisationId": this.state.organisation_id,
                "kbId": this.state.kb_id, "sid": "", "sourceId": this.state.source_id, "data": data.data});
        }
    }


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row justify-content-center">
                <div className="col-6">
                    <div class="alert alert-warning small py-2" role="alert">
                        <p className="mb-2">The WordPress crawler is an external entity controlled by the SimSage WordPress plugin.</p>
                        <p className="mb-0">
                        As such there are no properties to configure here, nor is there a schedule for SimSage to work to.
                        </p>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-6 wp-form">
                    {specific_json.source_id > 0 &&
                        <div className="export-wp d-flex align-items-center mb-4">
                            <label className="small me-3">Export the contents of this source as a WordPress GZip Archive</label>
                            <button className="btn btn-primary btn-block"
                                    onClick={() => exportArchive()}>Export</button>
                        </div>
                    }

                    {specific_json.source_id > 0 &&
                        <div className="import-wp d-flex align-items-center">
                            <lable className="small me-3">Import the contents of WordPress GZip Archive into this source</lable>
                            <RestoreWPArchive doUpload={(data) => restore(data)}
                                            organisationId={props.source.organisationId}
                                            kbId={props.source.kb_id}
                                            sourceId={specific_json.source_id}
                                            onError={(err) => this.props.setError("Error", err)} />
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}