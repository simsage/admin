import React, {useEffect, useState} from "react";
import Api from "../../../common/api";

export default function CrawlerGDriveForm(props) {


    const selected_source = props.source;

    const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const self = this;
    const theme = props.theme;
    const l_form_data = props.form_data;

    const [has_error,setError] = useState()
    const [time_now, setTimeNow] = useState(specific_json.deltaIndicator)

    const time2020 = 1577836800;
    let date_time_str = "complete crawl";

    if (specific_json.deltaIndicator > time2020){
        date_time_str = Api.toPrettyDateTime(new Date(time_now * 1));
    }



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


    function handleSetTimeNow() {
        const temp_time_now = Math.floor(Date.now())
        setTimeNow(temp_time_now)
        console.log("handleSetTimeNow",time_now)
    }

    if (has_error) {
        return <h1>CrawlerFileForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                    <span className="office-manual-box">
                    <a href="resources/simsage-google-drive-setup.pdf" id="dlGDrive" target="_blank" title="download the SimSage Google-drive setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="google-drive setup guide" className="image-size" />
                        </a>
                    </span>
            </div>

            <div className="form-group">
                <div className="full-column-2">
                    <span className="label-right-top">JSON key contents</span>
                    <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="7"
                                          placeholder="the Google JSON key identifying the service account to use to access and impersonate user-drive data.  Leave empty if you've already set this value previously and don't want to change it."
                                          value={specific_json.json_key_file}
                                          onChange={(event) => {setData({json_key_file: event.target.value})}}
                                />
                            </form>
                        </span>
                </div>
            </div>

            <div className="form-group">
                <div className="full-column-2">
                    <span className="label-right-top">user list</span>
                    <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="3"
                                          placeholder="a list of user email-addresses separated by commas whose drives to crawl (required!)"
                                          value={specific_json.drive_user_csv}
                                          onChange={(event) => {setData({drive_user_csv: event.target.value})}}
                                />
                            </form>
                        </span>
                </div>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">drive id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="drive id (optional)"
                                       value={specific_json.drive_id}
                                       onChange={(event) => {setData({drive_id: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                <span className="right-column">
                    </span>
            </div>

            <div className="form-group">
                <div className="full-column-2" style={{marginLeft: '170px', width: '400px'}}>
                    <div style={{float: 'left'}} title="Check this box if you only want to crawl Google Sites from this drive.">
                        <input type="checkbox"
                               checked={specific_json.sites_only}
                               onChange={(event) => { setData({sites_only: event.target.checked}); }}
                               value="Crawl only Google site data from these drives?"
                        />
                        <span className="label-left">Crawl only Google site data from these drives?</span>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <div className="full-column-2">
                    <span className="label-right-top">time to check from</span>
                    <span className="big-text">
                            <table>
                                <tbody>
                                <tr>
                                    {/*<td>*/}
                                    {/*    <input type="text" className="form-control dropbox-text-width"*/}
                                    {/*           spellCheck={false}*/}
                                    {/*           style={{width: "200px", marginRight: "10px"}}*/}
                                    {/*           placeholder="time to check from"*/}
                                    {/*           value={time_now}*/}
                                    {/*           onChange={(event) => {setData({deltaIndicator: event.target.value})}}*/}
                                    {/*    />*/}
                                    {/*</td>*/}
                                    <td>
                                        <a className="btn bt-sm btn-primary" onClick={() => handleSetTimeNow()}>now</a>
                                    </td>
                                    <td>
                                        <div style={{width: "200px", marginLeft: "30px"}}>{date_time_str}</div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </span>
                </div>
            </div>

        </div>
    );

}