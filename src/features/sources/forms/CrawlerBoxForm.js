import React, {useEffect, useState} from "react";
import Api from "../../../common/api";

export default function CrawlerBoxForm(props) {

    // 2020-01-01 00:00 GMT (without milliseconds)
    const time2020 = 1577836800;

    const selected_source = props.source;

    const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const self = this;
    const theme = props.theme;
    const l_form_data = props.form_data;

    const [has_error,setError] = useState()

    let date_time_str = "complete crawl";

    if (specific_json.timeToCheckFrom > time2020)
        date_time_str = Api.toPrettyDateTime(new Date(specific_json.timeToCheckFrom * 1000));


    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json,...data})
    }

    function setTimeToNow(e) {
        e.preventDefault()
        setData({timeToCheckFrom: Math.floor(Date.now() / 1000)});
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        console.log("specific_json in rss", specific_json)
    }, [specific_json])


    if (has_error) {
        return <h1>crawler-dropbox.js: Something went wrong.</h1>;
    }

    return (

        <div className="crawler-page">

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       autoFocus={true}
                                       spellCheck={false}
                                       placeholder="client id"
                                       value={specific_json.clientId}
                                       onChange={(event) => {setData({clientId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                <span className="dropbox-manual-box">
                        <a href="../resources/simsage-box-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage Box setup guide">
                            <span className="instructions-label">box setup guide/instructions</span>
                            {/*<img src="/images/icon/icon_fi-pdf.svg" alt="box setup guide" className="image-size" />*/}
                        </a>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client secret</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="client secret"
                                       value={specific_json.clientSecret}
                                       onChange={(event) => {setData({clientSecret: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="right-column">
                        <span className="small-label-right">enterprise id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="enterprise id"
                                       value={specific_json.enterpriseId}
                                       onChange={(event) => {setData({enterpriseId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="right-column">
                        <span className="small-label-right">time to check from</span>
                        <span className="big-text">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "200px", marginRight: "10px"}}
                                               placeholder="time to check from"
                                               value={specific_json.timeToCheckFrom}
                                               onChange={(event) => {setData({timeToCheckFrom: event.target.value})}}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn bt-sm btn-primary" onClick={(e) => setTimeToNow(e)}>now</button>
                                    </td>
                                    <td>
                                        <div style={{width: "200px", marginLeft: "30px"}}>{date_time_str}</div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </span>
                    </span>
            </div>

            <div className="form-group py-3">
                You can enter multiple folders separated by commas.  Each folder must be part of the root folder and not contain any sub-folders.
                You can leave this entry empty to crawl all folders.  Each folder name must start with '/'.
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">start folder</span>
                        <span className="big-text">
                            <input type="text" className="form-control textarea-width"
                                   value={specific_json.folderList}
                                   onChange={(event) => {setData({folderList: event.target.value})}}
                            />
                        </span>
                    </span>
            </div>

        </div>
    )
}