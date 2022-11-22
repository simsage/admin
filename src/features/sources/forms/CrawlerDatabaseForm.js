import React, {useEffect, useState} from "react";
import Api from "../../../common/api";

export default function CrawlerDatabaseForm(props) {

    const type_list = [
        {"key": "none", "value": "please select database type"},
        {"key": "mysql", "value": "MySQL"},
        {"key": "postgresql", "value": "Postgresql"},
        {"key": "microsoftsql", "value": "Microsoft SQL"},
    ];

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
        console.log("specific_json in database", specific_json)
    }, [specific_json])


    if (has_error) {
        return <h1>CrawlerDatabaseForm.js: Something went wrong.</h1>;
    }

    return (

        <div className="crawler-page">

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">user name</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="the user name for db access"
                                       autoFocus={true}
                                       value={specific_json.username}
                                       onChange={(event) => {setData({username: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                <span className="right-column">
                        <span className="small-label-right">password</span>
                        <span className="big-text">
                            <form>
                                <input type="password" className="form-control"
                                       placeholder="password"
                                       value={specific_json.password}
                                       onChange={(event) => {setData({password: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>


            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">jdbc string</span>
                        <span className="big-text">
                            <input type="text" className="form-control jdbc-field-width"
                                   placeholder="jdbc connection string, e.g. jdbc:microsoft:sqlserver://HOST:1433;DatabaseName=DATABASE"
                                   value={specific_json.jdbc}
                                   onChange={(event) => {setData({jdbc: event.target.value})}}
                            />
                        </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">database</span>
                        <span className="big-text">
                            <select className="form-select" onChange={(event) => {setData({type: event.target.value})}}
                                    defaultValue={specific_json.type}>
                                {
                                    type_list.map((value) => {
                                        return (<option key={value.key} value={value.key}>{value.value}</option>)
                                    })
                                }
                            </select>
                        </span>
                    </span>
                <span className="right-column">
                        <span className="small-label-right">pk field</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="primary key field name"
                                       value={specific_json.pk}
                                       onChange={(event) => {setData({pk: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>


            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">web fields</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control jdbc-field-width"
                                       placeholder="document http/https reference SQL fields in square brackets [FIELD-NAME]"
                                       disabled={specific_json.customRender}
                                       value={specific_json.content_url}
                                       onChange={(event) => {setData({content_url: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
            </div>


            <div className="form-group">
                <span className="label-right-top">select</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="SQL query, a valid SELECT statement, no other allowed"
                                  rows={3}
                                  value={specific_json.query}
                                  onChange={(event) => {setData({query: event.target.value})}}
                        />
                    </span>
            </div>


            <div className="form-group">
                <span className="label-right-top">text index template</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="sql text index template, an text template referencing SQL fields in square brackets [FIELD-NAME]"
                                  disabled={!specific_json.customRender}
                                  rows={4}
                                  value={specific_json.text}
                                  onChange={(event) => {setData({text: event.target.value})}}
                        />
                    </span>
            </div>


            <div className="form-group">
                <span className="label-right-top">html template</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="sql html render template, an html template referencing SQL fields in square brackets [FIELD-NAME]"
                                  disabled={!specific_json.customRender}
                                  rows={4}
                                  value={specific_json.template}
                                  onChange={(event) => {setData({template: event.target.value})}}
                        />
                    </span>
            </div>

        </div>
    )
}