import React, {useEffect, useState} from "react";

export default function CrawlerIManageForm(props) {


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

    function resetCursor(e) {
        e.preventDefault();
        setData({cursor: '0'});
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        console.log("specific_json in rss", specific_json)
    }, [specific_json])



    if (has_error) {
        return <h1>CrawlerIManageForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">server</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       autoFocus={true}
                                       spellCheck={false}
                                       placeholder="server FQDN (e.g. imanage.simsage.ai)"
                                       value={specific_json.server}
                                       onChange={(event) => {setData({server: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                <span className="dropbox-manual-box">
                        <a href="../resources/imanage-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage iManage setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="box setup guide" className="image-size" />
                        </a>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">admin username</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="administrator's username"
                                       value={specific_json.username}
                                       onChange={(event) => {setData({username: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">admin password</span>
                        <span className="big-text">
                            <form>
                                <input type="password" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="administrator's password"
                                       value={specific_json.password}
                                       onChange={(event) => {setData({password: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="client id"
                                       value={specific_json.clientId}
                                       onChange={(event) => {setData({clientId: event.target.value})}}
                                />
                            </form>
                        </span>
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
                        <span className="small-label-right">library id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="library id (e.g. Active)"
                                       value={specific_json.libraryId}
                                       onChange={(event) => {setData({libraryId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="right-column">
                        <span className="small-label-right">Event-cursor index to check from</span>
                        <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "200px", marginRight: "10px"}}
                                               placeholder="event-cursor index to check from"
                                               value={specific_json.cursor}
                                               onChange={(event) => {setData({cursor: event.target.value})}}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn bt-sm btn-primary" onClick={(e) => resetCursor(e)}>reset</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                    </span>
            </div>

            <div className="form-group small-text-with-width">
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