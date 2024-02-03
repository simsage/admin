import {useDispatch, useSelector} from "react-redux";
import {addOrUpdate, closeForm} from "./synsetSlice";
import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";


export default function SynsetForm() {
    const dispatch = useDispatch();

    const selected_synset = useSelector((state) => state.synsetReducer.selected_synset)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    // set title
    const title = (selected_synset) ? "Edit syn-set " + selected_synset.word : "Add new syn-set";
    const show_synset_form = useSelector((state) => state.synsetReducer.show_synset_form)

    //Form Hook
    const {register,
        handleSubmit,
        getValues,
        formState: {errors},
        reset} = useForm();

    const [wordCloudFields, setWordCloudFields] = useState(selected_synset ? selected_synset.wordCloudCsvList : [])

    //set default value
    useEffect(() => {
        let defaultValues = {};
        defaultValues.word = selected_synset ? selected_synset.word : '';
        defaultValues.lemma = selected_synset ? selected_synset.lemma : '';
        //add two blank word cloud when adding a new syn-set
        defaultValues.wordCloudCsvList = selected_synset ? selected_synset.wordCloudCsvList : setWordCloudFields(["", ""]);
        reset({...defaultValues});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_synset, show_synset_form]);


    //add a word cloud field
    function newSyn(e) {
        e.preventDefault()
        const newWordCloudFields = wordCloudFields.concat("")
        setWordCloudFields(newWordCloudFields);
    }


    // delete a word cloud field
    function deleteSyn(index) {

        let nArr = [];
        for (let i = 0; i < wordCloudFields.length; i++) {
            if (i !== index) {
                nArr.push(wordCloudFields[i]);
            }
        }
        setWordCloudFields(nArr);
    }


    //on submit store or update
    const onSubmit = data => {
        let list = data.wordCloudCsvList.filter(o => o !== '');
        if(list.length > 1){
            data.lemma = data.word;
            dispatch(addOrUpdate({
                organisation_id: selected_organisation_id,
                kb_id: selected_knowledge_base_id,
                session_id: session_id,
                data: data
            }))
            handleClose()
        }

    };

    const handleClose = () => {
        dispatch(closeForm());
        setWordCloudFields(['', '']);
    }

    if (!show_synset_form)
        return (<div/>);
    return (

        <div className="modal user-display" tabIndex="-1" role="dialog"
             style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">

                        <h4 className="mb-0">{title}</h4>

                    </div>


                    {/*form starts*/}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body p-0">
                            <div className="tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>

                                <div className="row mb-4">
                                    <div className="control-row col-6">

                                        <span className="label-2 required">SynSet</span>
                                        <input
                                            type="text" className="form-control"
                                            autoComplete="false"
                                            placeholder="e.g. Law..."

                                            {...register("word", {required: true})} />

                                        {errors.word && <span className="text-danger fst-italic small"> SynSet is required <br/></span>}
                                    </div>
                                    <div className="row mb-3 py-4">
                                        <div className="d-flex justify-content-between small">
                                            <label className="label-2">Word Cloud <span
                                                className="small text-black-50 fst-italic fw-light">(Separate by comma) </span></label>
                                            <span
                                                className="small text-black-50 fst-italic fw-light ms-2">(Type &amp; press enter to add another)</span>
                                        </div>

                                        {wordCloudFields.map((item, index) => {
                                            return (
                                                <div className="control-row col-12 mb-2" key={index}>
                                                    <span className="text">
                                                    <div className="form-control d-flex p-0 overflow-hidden align-items-start">
                                                        <textarea
                                                            className="border-0 w-100 mb-0 me-2 d-block" style={{padding: "0.375rem 0.75rem"}}
                                                            autoComplete="false"
                                                            rows="3"
                                                            placeholder="e.g. Family, Divorce, Custody..."
                                                            {...register("wordCloudCsvList[" + index + "]")}

                                                        />

                                                        {index > 1 &&
                                                            <button onClick={() => deleteSyn(index)}
                                                                    className="btn pointer-cursor mb-0 px-3 py-1"
                                                                    title="Remove Word Cloud">
                                                                &times;
                                                            </button>
                                                        }
                                                    </div>
                                                </span>
                                                    {index < 2 && getValues("wordCloudCsvList[" + index + "]") === '' &&
                                                        <span className="text-danger fst-italic small"> Word cloud is required <br/></span>
                                                    }
                                                </div>
                                            )
                                        })}


                                        <div className="control-row col-12 mb-3">
                                            <div className="new-syn-button">
                                                <button className="btn-secondary btn pointer-cursor px-3"
                                                        title="Add another Word Cloud" onClick={(e) => newSyn(e)}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4"
                                onClick={(e) => handleClose(e)}>Cancel
                        </button>
                        <button className="btn btn-primary btn-block px-4" type="submit">Save</button>
                    </div>
                    </form>

                </div>
            </div>
        </div>
    )
}