import React, {useEffect, useState} from "react";
import RestoreWPArchive from "../../../common/restore-wp-archive";
import Comms from "../../../common/comms";

export default function CrawlerWordPressForm(props) {


    const selected_source = props.source;

    const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const self = this;
    const theme = props.theme;
    const l_form_data = props.form_data;

    const [has_error,setError] = useState()


    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json,...data})
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        console.log("specific_json in rss", specific_json)
    }, [specific_json])



    function exportArchive() {
        if (this.props.session && this.props.session.id)
            Comms.download_export_archive(this.state.organisation_id, this.state.kb_id, this.state.source_id, this.props.session.id);
    }

    function restore(data) {
        if (data && data.data && data.data.length > 0) {
            // sid will be set by wpUploadArchive
            this.props.wpUploadArchive({"organisationId": this.state.organisation_id,
                "kbId": this.state.kb_id, "sid": "", "sourceId": this.state.source_id, "data": data.data});
        }
    }


    console.log("source",props.source)
    if (has_error) {
        return <h1>CrawlerFileForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">
            <div className="wp-form">
                The WordPress crawler is an external entity controlled by the SimSage WordPress plugin.<br/>
                As such there are no properties to configure here, nor is there a schedule for SimSage to work to.<br/><br/>

                {specific_json.source_id > 0 &&
                    <div className="export-wp">
                        <div>export the contents of this source as a WordPress GZip Archive</div>
                        <button className="btn btn-primary btn-block"
                                onClick={() => exportArchive()}>Export WordPress Archive</button>
                    </div>
                }

                {specific_json.source_id > 0 &&
                    <div className="import-wp">
                        <div className="import-text">import the contents of  WordPress GZip Archive into this source</div>
                        <RestoreWPArchive doUpload={(data) => restore(data)}
                                          organisationId={props.source.organisationId}
                                          kbId={props.source.kb_id}
                                          sourceId={specific_json.source_id}
                                          onError={(err) => this.props.setError("Error", err)} />
                    </div>
                }

            </div>
        </div>
    )
}