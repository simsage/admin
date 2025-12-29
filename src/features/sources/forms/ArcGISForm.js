import React, {useEffect} from "react";
import {BsFilePdf} from 'react-icons/bs'
import {DOCUMENTATION, useSelectedSource} from "./common";

export default function ArcGISForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (props.set_verify) props.set_verify('n/a')
    }, [props])

    useEffect(() => {

        const validate_arc_gis = () => {
            const {server, mapServer} = specific_json
            let missing = []

            if ((server ?? "").length < 4)
                missing.push("ArcGIS server name")

            if ((mapServer ?? "").length < 1)
                missing.push("ArcGIS Map Server")

            return (missing.length > 0) ? `ArcGIS Crawler: please provide the ${missing.join(", ")}` : null
        }

        if (props.set_verify) props.set_verify(() => validate_arc_gis)

    }, [props, specific_json])

    return (
        <div className="tab-content px-5 py-4 overflow-auto">

            <div className="row mb-3">
                <div className="form-group col-8">

                    <label className="small required">
                        ArcGIS server name
                    </label>
                    <input type="text"
                           placeholder="(e.g. sampleserver6.arcgisonline.com)"
                           title="ArcGIS server name (fqdn)"
                           autoFocus={true}
                           className="form-control"
                           value={specific_json.server}
                           onChange={(event) => {
                               setData({server: event.target.value})
                           }}
                    />
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.ARC_GIS} id="dlArcGIS" target="_blank" rel="noreferrer"
                       title="Download the SimSage AcrGIS setup guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"></span>ArcGIS<br/>Setup Guide
                    </a>
                </div>
            </div>

            <div className="row mb-3">
                <div className="form-group col-6">

                    <label className="small required">
                        ArcGIS Map Server
                    </label>
                    <input type="text"
                           placeholder="(e.g. USA)"
                           title="ArcGIS map-server name"
                           autoFocus={true}
                           className="form-control"
                           value={specific_json.mapServer}
                           onChange={(event) => {
                               setData({mapServer: event.target.value})
                           }}
                    />
                </div>
                <div className="form-group col-6 form-check form-switch pt-4" title={"use HTTPS or HTTP"}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={specific_json.isHttps === true}
                        onChange={(e) => setData({isHttps: e.target.checked})}
                    />
                    <label className="form-check-label small">
                        use HTTPS
                    </label>
                </div>
            </div>


        </div>
    )
}
