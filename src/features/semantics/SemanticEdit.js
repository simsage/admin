import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {closeSemanticForm, updateSemantics} from "./semanticSlice";
import {useForm} from "react-hook-form";

export function SemanticEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const show_semantic_form = useSelector((state) => state.semanticReducer.show_semantic_form);
    const selectedSemantic = useSelector( (state) => state.semanticReducer.edit);

    //Memory details
    // const [word, setWord] = useState('');
    // const [semantic, setSemantic] = useState('');
    // const [error, setError] = useState('');
    // Grab memory details if editing

    const {register, handleSubmit, formState: {errors}, reset} = useForm();


    useEffect(()=> {
        let defaultValues = {};
        defaultValues.word = selectedSemantic ? selectedSemantic.word : '';
        defaultValues.semantic = selectedSemantic ? selectedSemantic.semantic : '';
        reset({...defaultValues});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_semantic_form,selectedSemantic])


    function handleClose(){
        dispatch(closeSemanticForm())
    }


    const onSubmit = data => {
        const session_id = session.id;
        data = {...data,  "prevWord": selectedSemantic ? selectedSemantic.word : ""}
        dispatch(updateSemantics({session_id, organisation_id, knowledge_base_id, data}));
        dispatch(closeSemanticForm());
    }

    if (!show_semantic_form)
        return (<div/>);

    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4">
                        <h4 className="mb-0">{selectedSemantic ? "Edit Semantic" : "New Semantic"}</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body p-0">
                            <div className="tab-content px-5 py-4 overflow-auto">
                                <div className="row mb-3">
                                    <div className="control-row col-6">
                                        <span className="label-2 small required">Word</span>
                                        <span className="text">
                                        {/*<form>*/}
                                            <input type="text" className="form-control"
                                                   autoFocus={true}
                                                   autoComplete="false"
                                                   placeholder="e.g. Wellington"
                                                   onKeyDown={(e) => {if(e.key === 'Enter') e.preventDefault()}}
                                                // value={word}
                                                   {...register("word", {required: true})}
                                                // onChange={(event) => setWord(event.target.value)}
                                            />
                                            {/*</form>*/}
                                    </span>
                                        {errors.word && <span className="text-danger fst-italic small"> Word is required</span>}
                                    </div>
                                    <div className="control-row col-6">
                                        <span className="label-2 small required">Semantic</span>
                                        <span className="text">
                                        {/*<form>*/}
                                            <input type="text" className="form-control"
                                                   autoComplete="false"
                                                   placeholder="e.g. City"
                                                   onKeyDown={(e) => {if(e.key === 'Enter') e.preventDefault()}}
                                                // value={semantic}
                                                   {...register("semantic", {required: true})}
                                                // onChange={(event) => semantic(event.target.value)}
                                            />
                                            {/*</form>*/}
                                    </span>
                                        {errors.semantic && <span className="text-danger fst-italic small"> Semantic is required</span>}
                                    </div>
                                </div>

                                <div className="row mt-3 mb-3">
                                    <div className="alert alert-warning small py-2" role="alert">
                                        Semantics are case sensitive.  Semantics are "is a" relationships, e.g.,
                                        "Word: Wellington is a Semantic: city".  The semantic itself must be
                                        lower-case and not include any patterns.<br /><br />
                                        You can use matching patterns in the Word-part for more general types, provided
                                        the word starts with (at least) two constant consecutive letters, where:<br/>
                                        # (hash) to match a single digit 0..9< br/>
                                        * (asterisk / star) to match single letters a..z or A..Z<br/>
                                        + (plus) to match a single digit 0..9 or letter a..z, A..Z<br/>
                                        e.g., MIMR-####-#### will match MIMR-2020-0128 and MIMR-2025-0125
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer px-5 pb-3">
                            <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                            {/*<button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>*/}
                            <input type="submit" value="Save" className={"btn btn-primary px-4"}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
