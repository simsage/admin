import React, {useEffect, useState} from "react";
import SensitiveCredential from "../../../components/SensitiveCredential";
import { useSelectedSource } from './common.js';


export default function CrawlerDatabaseForm(props) {

    // Fetch selected source and calculate source_saved using custom hook
    const {
        selected_source,
        source_saved,
        specific_json,
        setSpecificJson,
        l_form_data
    } = useSelectedSource(props);

    const [placeholder, setPlaceholder] = useState({ type: 'none' });
    const [templateType, setTemplateType] = useState(false)

    const type_list = [
        {"key": "none", "value": "Please select database type..."},
        {"key": "postgresql", "value": "Postgresql"},
        {"key": "microsoftsql", "value": "Microsoft SQL"},
        {"key": "mysql", "value": "Meria DB"}
    ]

    const placeholder_JDBC = [
        {"key": "none", "value": "e.g. jdbc:microsoft:sqlserver://HOST:1433;DatabaseName=DATABASEs"},
        {"key": "microsoftsql", "value": "jdbc:microsoft.sqlserver://<server>:1433;DatabaseName=<db>"},
        {"key": "postgresql", "value": "jdbc:postgresql://<server>:5432/<db>"},
        {"key": "mysql", "value": "jdbc:mariadb:Database=<db>;Server=<server>;Port=3306"}
    ]

    const handleTemplateChange = (event) => {
        const selected = event.target.checked;
        setTemplateType(selected)
    }

    const handleTypeChange = (event) => {
        const selectedType = event.target.value
        setPlaceholder({ type: selectedType })
        setData({type: event.target.value})
    }

    // form defaults
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

    // update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json,...data})
    }

    // update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson:specific_json_stringify})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specific_json])


    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            {/*****************************************-USERNAME & PASSWORD-*****************************************/}
            <div className="row mb-3">
                <div className="form-group col-4">
                    <label className="small required">Username</label>
                    <input type="text"
                           placeholder="For DB access"
                           autoFocus={true}
                           className="form-control"
                           value={specific_json.username}
                           onChange={(event) => {
                               setData({username: event.target.value})
                           }}
                           required
                    />
                </div>
                <div className="form-group col-4">
                    <SensitiveCredential
                        selected_source={selected_source}
                        specific_json={specific_json.password}
                        onChange={(event) => {
                            setData({password: event.target.value})
                        }}
                        name="Password"
                        placeholder="**********"
                        required={!source_saved}
                    />
                </div>
            </div>

            {/******************************************-JDBC STRING-******************************************/}
            <div className="row mb-3">
                <div className="form-group col-8">
                    <label className="small required">JDBC string</label>
                    <input type="text"
                           placeholder={placeholder_JDBC.find(
                               (item) => item.key === placeholder.type)?.value}
                           className="form-control"
                           value={specific_json.jdbc}
                           onChange={(event) => {
                               setData({jdbc: event.target.value})
                           }}
                           required
                    />
                </div>
            </div>

            {/******************************************-DB & P-KEY-******************************************/}
            <div className="row mb-3">
                <div className="form-group col-4">
                    <label className="small required">Database</label>
                    <select
                        required
                        className="form-select"
                        onChange={handleTypeChange}
                        defaultValue={specific_json.type}>
                        {
                            type_list.map((value) => {
                                return (<option key={value.key} value={value.key}>{value.value}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="form-group col-4">
                    <label className="small required">Primary key field</label>
                    <input type="text"
                           placeholder="Primary key for database..."
                           className="form-control"
                           value={specific_json.pk}
                           onChange={(event) => {
                               setData({pk: event.target.value})}}
                           required
                    />
                </div>
            </div>

            {/******************************************-WEB FIELDS-******************************************/}
            <div className="row mb-3">
                <div className="form-group col-8">
                    <label className="small required">SQL Columns</label>
                    <input type="text"
                           placeholder="SQL Select column names (csv)."
                           className="form-control"
                           value={specific_json.column_csv}
                           onChange={(event) => {
                               setData({column_csv: event.target.value})
                           }}
                           required
                    />
                </div>
            </div>

            {/************************************-SELECT-************************************/}
            <div className="row mb-3">
                <div className="form-group col-6">
                    <label className="small required">Select</label>
                    <textarea className="form-control"
                              placeholder="SQL query, a valid SELECT statement, no other allowed"
                              rows="3"
                              value={specific_json.query}
                              onChange={(event) => {
                                  setData({query: event.target.value})}}
                              required
                    />
                </div>
            </div>
            {/*************************************-CHECK BOX-*************************************/}
            <div className="row mb-3">
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="If checked, HTML template will be provided instead.">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={(event) => {
                                handleTemplateChange(event)}
                            }
                        />
                        <label className="form-check-label small">HTML Template</label>
                    </div>
                </div>
            </div>
            {/***********************************-HTML TEMPLATE / TEXT TEMPLATE-***********************************/}
            <div className="row mb-3">
                {!templateType &&
                    <div className="form-group col-12">
                        <label className="small required">Text Template</label>
                        <textarea className="form-control"
                                  placeholder="SQL text index template, an text template
                                            referencing SQL fields in square brackets [FIELD-NAME]"
                                  rows={10}
                                  value={specific_json.text}
                                  onChange={(event) => {
                                      setData({text: event.target.value})}}
                                  required
                        />
                    </div>
                }
                {templateType &&
                    <div className="form-group col-12" >
                        <label className="small required">HTML Template</label>
                        <textarea className="form-control"
                                  placeholder="SQL html render template, an html template
                                                referencing SQL fields in square brackets [FIELD-NAME]"
                                  rows={20}
                                  value={specific_json.html?specific_json.html:default_template_val}
                                  onChange={(event) => {
                                      setData({html: event.target.value})}}
                                  required
                        />
                    </div>
                }
            </div>
        </div>
    )
}