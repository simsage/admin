import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {addOrUpdateTextToSearch, closeEditForm} from "./TextToSearchSlice";
import {BsFilePdf} from "react-icons/bs";
import {useForm} from "react-hook-form";


export function TextToSearchEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_text_to_search_form = useSelector( (state) => state.textToSearchReducer.show_text_to_search_form)
    const selected_item = useSelector( (state) => state.textToSearchReducer.edit);
    const show_error_form = useSelector( (state) => state.textToSearchReducer.show_error_form);
    const error = useSelector( (state) => state.textToSearchReducer.error);

    const {register, handleSubmit, formState: {errors}, reset} = useForm();

    console.log("selected_item", selected_item)

    function handleClose(){
        dispatch(closeEditForm());
    }

    useEffect(()=>{
        let defaultValues = {};
        defaultValues.matchWordCsv = selected_item ? selected_item.matchWords : '';
        defaultValues.searchPart = selected_item ? selected_item.searchPart : '';
        defaultValues.searchType = selected_item ? selected_item.type : '';
        reset({...defaultValues});
    },[show_text_to_search_form,selected_item, reset])

    const onSubmit = data => {
        const session_id = session.id;
        data = {...data, organisation_id: organisation_id, kb_id: knowledge_base_id}
        dispatch(addOrUpdateTextToSearch({session_id:session_id,organisation_id:organisation_id, kb_id: knowledge_base_id, data}));

    }

    if (show_text_to_search_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light"><h4 className="mb-0">{selected_item ? "Edit Text to Search" : "New Text to Search"}</h4></div>

                    <form onSubmit={handleSubmit(onSubmit)} >

                        <div className="modal-body p-0">
                            <div className="tab-content px-5 py-4 overflow-auto">
                                <div className="row">
                                    <div className="col-10">
                                        <div className="row mb-3">
                                            <div className="control-row col-8">
                                                <span className="label-2 small">SimSage advanced query language part</span>
                                                <span className="text">
                                                    <input type="text" className="form-control"
                                                           autoComplete="false"
                                                           placeholder="e.g. (word(test))"
                                                           title="SimSage advanced query language expression (e.g. (word(test))  )"
                                                           {...register('searchPart',{required:true})}

                                                        // value= {searchPart}
                                                        // onChange={(e) => setSearchPart(e.target.value)}
                                                        // onKeyDown={(e) => {if(e.key === 'Enter') e.preventDefault()}}
                                                    />

                                            </span>
                                                {errors.searchPart &&
                                                    <span className="text-danger fst-italic small">SimSage advanced query language part is required </span>}
                                            </div>
                                            <div className="control-row col-4">
                                                <span className="label-2 small">Type</span>
                                                <span className="text">
                                                    <input type="text" className="form-control"
                                                           autoComplete="false"
                                                           placeholder="e.g. and"
                                                           {...register('searchType',{required:true})}
                                                        // value= {searchType}
                                                        // onChange={(e) => setSearchType(e.target.value)}
                                                        // onKeyDown={(e) => {if(e.key === 'Enter') e.preventDefault()}}
                                                    />
                                                    {errors.searchType &&
                                                        <span className="text-danger fst-italic small">Type is required </span>}

                                                    {show_error_form && error.includes("searchType") &&
                                                        <span className="text-danger fst-italic small">{error}</span>}
                                            </span>
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="control-row col-12">
                                                <span className="label-2 small">Match Words <span className="small text-black-50 fst-italic fw-light">(Separate by comma) (csv) </span></span>
                                                <span className="text">
                                                    <textarea className="form-control"
                                                              autoComplete="false"
                                                              placeholder="e.g. web documents, html file, web file, etc..."
                                                              {...register('matchWordCsv',{required:true})}
                                                        rows={10}
                                                        // onChange={(event) => setMatchWords(event.target.value)}
                                                    />
                                                </span>
                                                {errors.matchWordCsv &&
                                                    <span className="text-danger fst-italic small">Match Words are required </span>}

                                                {show_error_form && error.includes("match-word") &&
                                                    <span className="text-danger fst-italic small">{error}</span>}


                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2">

                                        <a href="/resources/super-search-syntax.pdf" id="dlsuperquery" target="_blank"
                                           title="Download the SimSage advanced query syntax guide"
                                           className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                                            <BsFilePdf size={25}/>
                                            <span className="me-2 mt-2"></span>Advanced Query<br/>Syntax Guide
                                        </a>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer px-5 pb-3">
                            <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                            {/*<button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>*/}
                            <input className="btn btn-primary btn-block px-4" type={"submit"} value={"Save"}/>
                        </div>

                    </form>

                </div>
            </div>

            {/*{show_error_form &&*/}
            {/*    <>*/}
            {/*        <ShowErrorForm show_error_form={show_error_form} error={errors} closeForm={handleClose} />*/}
            {/*    </>*/}
            {/*}*/}


        </div>

    )
}
