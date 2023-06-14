import React, {useEffect, useState} from "react";

export default function CrawlerDatabaseForm(props) {

    const type_list = [
        {"key": "none", "value": "Please select database type..."},
        {"key": "postgresql", "value": "Postgresql"},
        {"key": "microsoftsql", "value": "Microsoft SQL"},
    ];

    const selected_source = props.source;

    // const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    //form defaults
    const default_template_val = '<div class="ms-3 w-100">\n' +
        '  <div class="d-flex align-items-center text-align-end mb-1">\n' +
        '    <p class="mb-0 result-breadcrumb me-2">BREADCRUMB</p>\n' +
        '  </div>\n' +
        '    <span class="mb-2 results-filename text-break pointer-cursor" title="URL">TITLE</span>\n' +
        '    <div class="d-flex align-items-center mb-1">\n' +
        '      <span class="mb-0 result-details-title">URL</span>\n' +
        '    </div>\n' +
        '  <div class="d-flex align-items-center mb-1">\n' +
        '    <span class="mb-0 result-details">LAST_MODIFIED</span>\n' +
        '    <span class="d-flex align-items-center">\n' +
        '      <span class="mb-0 result-details mx-2">|</span>\n' +
        '      <span class="mb-0 result-details">AUTHOR</span>\n' +
        '    </span>\n' +
        '  </div>\n' +
        '  <div>\n' +
        '    <p class="small fw-light mb-2">RESULT_TEXT</p>\n' +
        '  </div>\n' +
        '  <div class="d-flex align-items-center flex-wrap"></div>\n' +
        '</div>\n';

    const l_form_data = props.form_data;

    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json,...data})
    }

    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    return (

        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="row mb-3">
                <div className="form-group col-4">
                    <label className="small">Username</label>
                        <input type="text"
                                placeholder="For DB access"
                                autoFocus={true}
                                className="form-control"
                                value={specific_json.username}
                                       onChange={(event) => {setData({username: event.target.value})}}
                        />
                </div>
                <div className="form-group col-4">
                    <label className="small">Password</label>
                        <input type="password"
                                placeholder="********"
                                autoFocus={true}
                                className="form-control"
                                value={specific_json.password}
                                       onChange={(event) => {setData({password: event.target.value})}}
                        />
                </div>
            </div>
            <div className="row mb-3">
                <div className="form-group col-8">
                    <label className="small">JDBC string</label>
                        <input type="text"
                                placeholder="e.g. jdbc:microsoft:sqlserver://HOST:1433;DatabaseName=DATABASEs"
                                autoFocus={true}
                                className="form-control"
                                value={specific_json.jdbc}
                                   onChange={(event) => {setData({jdbc: event.target.value})}}
                        />
                </div>
            </div>
            <div className="row mb-3">
                <div className="form-group col-4">
                    <label className="small">Database</label>
                    <select className="form-select" onChange={(event) => {setData({type: event.target.value})}}
                            defaultValue={specific_json.type}>
                        {
                            type_list.map((value) => {
                                return (<option key={value.key} value={value.key}>{value.value}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="form-group col-4">
                    <label className="small">Primary key field</label>
                        <input type="text"
                                placeholder=""
                                autoFocus={true}
                                className="form-control"
                                value={specific_json.pk}
                                       onChange={(event) => {setData({pk: event.target.value})}}
                        />
                </div>
            </div>
            <div className="row mb-3">
                <div className="form-group col-8">
                    <label className="small">Web fields</label>
                        <input type="text"
                                placeholder="Document http/https reference SQL fields in square brackets [FIELD-NAME]"
                                autoFocus={true}
                                className="form-control"
                                disabled={specific_json.customRender}
                                       value={specific_json.content_url}
                                       onChange={(event) => {setData({content_url: event.target.value})}}
                        />
                </div>
            </div>
            <div className="row mb-3">
                <div className="form-group col-6">
                    <label className="small">Select</label>
                    <textarea className="form-control"
                            placeholder="SQL query, a valid SELECT statement, no other allowed"
                            rows="3"
                            value={specific_json.query}
                                  onChange={(event) => {setData({query: event.target.value})}}
                    />
                </div>
                <div className="form-group col-6">
                    <label className="small">Text index template</label>
                    <textarea className="form-control"
                            placeholder="SQL text index template, an text template referencing SQL fields in square brackets [FIELD-NAME]"
                            disabled={!specific_json.customRender}
                                  rows={3}
                                  value={specific_json.text}
                                  onChange={(event) => {setData({text: event.target.value})}}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="form-group col-12">
                    <label className="small">HTML template</label>
                    <textarea className="form-control"
                                  placeholder="SQL html render template, an html template referencing SQL fields in square brackets [FIELD-NAME]"
                                  disabled={!specific_json.customRender}
                                  rows={10}
                                  value={specific_json.template?specific_json.template:default_template_val}
                                  onChange={(event) => {setData({template: event.target.value})}}
                        />
                </div>
            </div>

        </div>
    )
}