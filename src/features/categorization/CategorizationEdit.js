import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {closeCategorizationForm, showPromptEngineeringForm, updateCategorizations} from "./categorizationSlice";
import {PromptEngineer} from "./PromptEngineer";



export function CategorizationEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_categorization_form = useSelector( (state) => state.categorizationReducer.show_categorization_form)
    const categorization = useSelector( (state) => state.categorizationReducer.edit);

    //Categorization details
    const [name, setName] = useState('');
    const [prevName, setPrevName] = useState('');
    const [metadata, setMetadata] = useState('');
    const [prompt, setPrompt] = useState('');
    const [numTokens, setNumTokens] = useState('1000');
    const [fileExtensions, setFileExtensions] = useState('');
    const [titleWordIncludes, setTitleWordIncludes] = useState('');
    const [titleWordExcludes, setTitleWordExcludes] = useState('');
    const [urlWordIncludes, setURLWordIncludes] = useState('');
    const [urlWordExcludes, setURLWordExcludes] = useState('');
    const [sourceIds, setSourceIds] = useState('');

    const [error,setError] = useState('');

    // Grab categorization details if editing
    useEffect(()=> {
        if (categorization && categorization.name) {
            setName(categorization.name);
            setPrevName(categorization.name);
            setMetadata(categorization.metadata);
            setPrompt(categorization.prompt);
            setNumTokens("" + categorization.numTokens)
            setFileExtensions(categorization.documentTypeList.join(", "))
            setTitleWordIncludes(categorization.titleWordIncludeList.join(", "))
            setTitleWordExcludes(categorization.titleWordExcludeList.join(", "))
            setURLWordIncludes(categorization.urlWordIncludeList.join(", "))
            setURLWordExcludes(categorization.urlWordExcludeList.join(", "))
            setSourceIds(categorization.validSourceIdList.join(", "))

        } else {
            resetData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_categorization_form])

    function resetData () {
        setName('');
        setPrevName('');
        setMetadata('');
        setPrompt('');
        setNumTokens("1000")
        setFileExtensions('')
        setTitleWordIncludes('')
        setTitleWordExcludes('')
        setURLWordIncludes('')
        setURLWordExcludes('')
        setSourceIds('')
        setError('')
    }

    function handleClose(){
        dispatch(closeCategorizationForm());
        resetData();
    }

    function toStringList(str) {
        let item_list = [];
        for (const item of str.split(",")) {
            if (item.trim().length > 0) {
                item_list.push(item.trim())
            }
        }
        return item_list;
    }

    function toIntList(str) {
        let item_list = [];
        for (const item of str.split(",")) {
            if (item.trim().length > 0) {
                const nt = parseInt(item.trim());
                if (!isNaN(item.trim()) && nt > 0)
                    item_list.push(nt)
            }
        }
        return item_list;
    }

    function handleTestPrompt(e) {
        e.preventDefault();
        dispatch(showPromptEngineeringForm({prompt}));
    }

    function handleSave(e) {
        e.preventDefault();
        setError('')
        if (name.trim().length === 0) { setError("name is required"); return }
        if (prompt.trim().length === 0) { setError("prompt is required"); return }
        if (metadata.trim().length === 0) { setError("metadata is required"); return }
        const nt = parseInt(numTokens.trim());
        if (isNaN(numTokens.trim()) || nt < 100 || nt > 1000000) { setError("number of tokens must be between 100 and 1,000,000"); return }

        const session_id = session.id;
        const data = {
            "organisationId": organisation_id,
            "kbId": knowledge_base_id,
            "name": name,
            "previousName": (name !== prevName) ? prevName : '',
            "metadata": metadata,
            "prompt": prompt,
            "numTokens": nt,
            "documentTypeList": toStringList(fileExtensions),
            "titleWordIncludeList": toStringList(titleWordIncludes),
            "titleWordExcludeList": toStringList(titleWordExcludes),
            "urlWordIncludeList": toStringList(urlWordIncludes),
            "urlWordExcludeList": toStringList(urlWordExcludes),
            "validSourceIdList": toIntList(sourceIds),
        }
        dispatch(updateCategorizations({session_id, organisation_id, knowledge_base_id, data}));
    }


    if (show_categorization_form === false)
        return (<div/>);

    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{categorization ? ("Edit " + categorization.name) : "New Categorization"}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto">

                            {error && error.length > 0 &&
                                <div className="row mb-3">
                                    <div className="control-row col-12">
                                        <span className="text-danger fst-italic small">{error}</span>
                                    </div>
                                </div>
                            }

                            <div className="row mb-3">
                                <div className="control-row col-6">
                                    <label className="label-2 small required">Categorization name</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="name"
                                               autoFocus={true}
                                               title="the name of this categorization"
                                               value={name}
                                               onChange={(event) => {
                                                   setName(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                                <div className="control-row col-6">
                                    <label className="label-2 small required">SimSage metadata field</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="metadata"
                                               title="the SimSage metadata field"
                                               value={metadata}
                                               onChange={(event) => {
                                                   setMetadata(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                            </div>


                            <hr/>


                            <div className="row mb-3 mt-4">
                                <div className="control-row col-12">
                                    <label className="label-2 small">file extension list</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="file extension filter (e.g. docx, doc, pdf)"
                                               title="a list of valid document types if set"
                                               value={fileExtensions}
                                               onChange={(event) => {
                                                   setFileExtensions(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                            </div>


                            <div className="row mb-3">
                                <div className="control-row col-6">
                                    <label className="label-2 small">url include words csv</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="words that must be in the url (csv)"
                                               title="a comma separated list of words that must be in the url"
                                               value={urlWordIncludes}
                                               onChange={(event) => {
                                                   setURLWordIncludes(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                                <div className="control-row col-6">
                                    <label className="label-2 small">url exclude words csv</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="words that must NOT be in the url (csv)"
                                               title="a comma separated list of words that must NOT be in the url"
                                               value={urlWordExcludes}
                                               onChange={(event) => {
                                                   setURLWordExcludes(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="control-row col-6">
                                    <label className="label-2 small">title include words csv</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="words that must be in the title (csv)"
                                               title="a comma separated list of words that must be in the title"
                                               value={titleWordIncludes}
                                               onChange={(event) => {
                                                   setTitleWordIncludes(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                                <div className="control-row col-6">
                                    <label className="label-2 small">title exclude words csv</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="words that must NOT be in the title (csv)"
                                               title="a comma separated list of words that must NOT be in the title"
                                               value={titleWordExcludes}
                                               onChange={(event) => {
                                                   setTitleWordExcludes(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                            </div>


                            <div className="row mb-3">
                                <div className="control-row col-12">
                                    <label className="label-2 small">source Id filter list</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="source Ids to filter by (e.g. 1,5,22)"
                                               title="a list of source Ids to filter by if set"
                                               value={sourceIds}
                                               onChange={(event) => {
                                                   setSourceIds(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                            </div>


                            <hr/>


                            <div className="row mb-3 mt-4">
                                <div className="control-row col-12">
                                    <label className="label-2 small required">LLM prompt</label>
                                    <span className="text">
                                        <form>
                                            <textarea className="form-control"
                                                      autoComplete="false"
                                                      placeholder="LLM prompt for this categorization"
                                                      value={prompt}
                                                      rows={10}
                                                      onChange={(event) => setPrompt(event.target.value)}
                                            />
                                        </form>
                                    </span>
                                </div>
                            </div>


                            <div className="row mb-3">
                                <div className="control-row col-6">
                                    <label className="label-2 small required">number of tokens to pass to the
                                        LLM</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="the number of tokens to pass"
                                               title="a number specifying the number of tokens to pass to the LLM [100, 1,000,000]"
                                               value={numTokens}
                                               onChange={(event) => {
                                                   setNumTokens(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleTestPrompt(e)}>Test prompt</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>

            <PromptEngineer/>

        </div>

    )
}
