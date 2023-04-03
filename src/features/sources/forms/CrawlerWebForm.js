import React, {useEffect, useState} from "react";

export default function CrawlerWebForm(props) {


    const selected_source = props.source;

    const [form_error, setFormError] = useState();
    //get specific_json from 'form_data'; if 'form_data' is null then get it from 'selected_source'
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ? props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : "{}"
    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))

    const self = this;
    const theme = props.theme;
    const l_form_data = props.form_data;

    const [has_error, setError] = useState()


    //update local variable specific_json when data is changed
    function setData(data) {
        setSpecificJson({...specific_json, ...data})
    }


    //update setFormData when specific_json is changed
    useEffect(() => {
        let specific_json_stringify = JSON.stringify(specific_json)
        props.setFormData({...l_form_data, specificJson: specific_json_stringify})
        console.log("specific_json in rss", specific_json)
    }, [specific_json])


    if (has_error) {
        return <h1>CrawlerFileForm.js: Something went wrong.</h1>;
    }

    return (
        <div className="crawler-page">

            <div className="form-group">
                <span className="label-right-top">http/s base url</span>
                <span className="full-column">
                        <input type="text"
                               placeholder="single http/s base url path (e.g. https://simsage.ai)"
                               autoFocus={true}
                               className="form-control"
                               value={specific_json.baseUrlList}
                               onChange={(event) => {
                                   setData({baseUrlList: event.target.value})
                               }}
                        />
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">valid extensions</span>
                        <span className="big-text">
                            <input type="text" className="form-control"
                                   value={specific_json.validExtensions}
                                   onChange={(event) => {
                                       setData({validExtensions: event.target.value})
                                   }}
                            />
                        </span>
                    </span>
                <span className="left-column">
                            <span className="small-label-right">ignore extensions</span>
                            <span className="big-text">
                            <input type="text" className="form-control"
                                   value={specific_json.validExtensionsIgnore}
                                   onChange={(event) => {
                                       setData({validExtensionsIgnore: event.target.value})
                                   }}
                            />
                            </span>
                    </span>
            </div>

            <div className="form-group">
                    <span className="left-column">
                            <span className="small-label-right">bearer token</span>
                            <span className="big-text">
                                <input type="text" className="form-control"
                                       value={specific_json.bearerToken}
                                       placeholder="an optional bearer token if available"
                                       title="(optional) bearer token"
                                       onChange={(event) => {
                                           setData({bearerToken: event.target.value})
                                       }}
                                />
                            </span>
                    </span>

                <span className="left-column">
                            <span className="small-label-right">username</span>
                            <span className="big-text">
                            <input type="text" className="form-control"
                                   value={specific_json.basicUsername}
                                   placeholder="optional basic auth username"
                                   title="(optional) basic auth username"
                                   onChange={(event) => {
                                       setData({basicUsername: event.target.value})
                                   }}
                            />
                            </span>
                    </span>


            </div>

            <div className="form-group">
                    <span className="left-column">
                             <span className="small-label-right">user-agent</span>
                            <span className="big-text">
                            <input type="text" className="form-control"
                                   placeholder="web-crawler's user-agent (blank to leave default)"
                                   title="(optional) web-crawler's user-agent"
                                   value={specific_json.userAgent}
                                   onChange={(event) => {
                                       setData({userAgent: event.target.value})
                                   }}
                            />
                            </span>
                    </span>
                    <span className="left-column">
                             <span className="small-label-right">password</span>
                            <span className="big-text">
                            <input type="password" className="form-control"
                                   placeholder="basic auth password (leave blank to keep previous)"
                                   title="(optional) basic auth password (leave blank to keep previous)"
                                   value={specific_json.password}
                                   onChange={(event) => {
                                       setData({password: event.target.value})
                                   }}
                            />
                            </span>
                    </span>
            </div>


            <div className="form-group">
                <span className="label-right-top">include css csv</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="css/html root fragments to include csv"
                                  rows="3"
                                  value={specific_json.webCss}
                                  onChange={(event) => {
                                      setData({webCss: event.target.value})
                                  }}
                        />
                    </span>
            </div>

            <div className="form-group">
                <span className="label-right-top">exclude css csv</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="css/html root fragments to exclude csv"
                                  rows="3"
                                  value={specific_json.webCssIgnore}
                                  onChange={(event) => {
                                      setData({webCssIgnore: event.target.value})
                                  }}
                        />
                    </span>
            </div>

            <div className="form-group">
                <span className="label-right-top">csv include words</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="csv words, include articles by words [optional]"
                                  rows="3"
                                  value={specific_json.articleIncludeWordsCsv}
                                  onChange={(event) => {
                                      setData({articleIncludeWordsCsv: event.target.value})
                                  }}
                        />
                    </span>
            </div>

            <div className="form-group">
                <span className="label-right-top">csv exclude words</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="csv words, exclude articles by words [optional]"
                                  rows="3"
                                  value={specific_json.articleExcludeWordsCsv}
                                  onChange={(event) => {
                                      setData({articleExcludeWordsCsv: event.target.value})
                                  }}
                        />
                    </span>
            </div>


            <div className="form-group">
                <span className="label-right-top">csv exclude words</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="csv words, exclude articles by words [optional]"
                                  rows="3"
                                  value={specific_json.articleExcludeWordsCsv}
                                  onChange={(event) => {setData({articleExcludeWordsCsv: event.target.value})}}
                        />
                    </span>
            </div>

            <div className="form-group">
                <span className="label-right-top">csv exclude prefixes</span>
                <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="csv urls (starting with https://), exclude pages by prefix starts [optional]"
                                  rows="3"
                                  value={specific_json.pagePrefixesToIgnore}
                                  onChange={(event) => {setData({pagePrefixesToIgnore: event.target.value})}}
                        />
                    </span>
            </div>

        </div>
    )
}