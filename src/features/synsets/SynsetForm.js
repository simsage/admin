import {useDispatch, useSelector, Controller} from "react-redux";
import {addOrUpdate, closeForm} from "./synsetSlice";
import {useForm, useFieldArray} from "react-hook-form";
import React, {useEffect, useState} from "react";


export default function SynsetForm() {
    const dispatch = useDispatch();
    const theme = null;

    const handleClose = () => {
        console.info("handleClose")
        dispatch(closeForm());
    }

    const selected_synset = useSelector((state) => state.synsetReducer.selected_synset)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    // console.log("data", selected_synset)
    // console.log("data", selected_synset.word)

    // set title
    const title = (selected_synset) ? "Edit syn-set " + selected_synset.word : "Add new syn-set";
    const synset_show_form = useSelector((state) => state.synsetReducer.show_data_form)

    //Form Hook
    const {register, handleSubmit, watch, formState: {errors, dirtyFields}, reset, control} = useForm();

    const [wordCloudFields, setWordCloudFields]=useState(selected_synset?selected_synset.wordCloudCsvList:[])


    //set default value
    useEffect(() => {
        let defaultValues = {};
        defaultValues.word = selected_synset?selected_synset.word:'';
        defaultValues.lemma = selected_synset?selected_synset.lemma:'';
        //add two blank word cloud when adding a new syn-set
        defaultValues.wordCloudCsvList = selected_synset?selected_synset.wordCloudCsvList:setWordCloudFields(["",""]);
        reset({...defaultValues});

    }, [selected_synset, synset_show_form]);



    // useEffect(() => {
    //     console.log("wordCloudCsvList",wordCloudCsvList)
    //     // newSyn()
    // }, [selected_synset === null]);


    //add a word cloud field
    function newSyn() {
        const newWordCloudFields = wordCloudFields.concat("")
        setWordCloudFields(newWordCloudFields);
    }

    // copied from edit page
    function updateWC(index, str) {
        const cl = this.state.cloud_list;
        cl[index] = str;
        this.setState({cloud_list: cl});
    }

    // delete a word cloud field
    function deleteSyn(index) {

        let nArr = [];
        for( let i = 0; i < wordCloudFields.length; i++){
            if ( i != index) {
                nArr.push(wordCloudFields[i]);
            }
        }
        setWordCloudFields(nArr);
    }

    // when pass nothing as argument, you are watching everything
    const watchAllFields = watch();
    useEffect(() => {
        console.log("watch: ",watchAllFields);
        console.count();
    }, [watchAllFields]);


    //on submit store or update
    const onSubmit = data => {
        console.log("data", data)
        data.lemma = data.word;
        dispatch(addOrUpdate({organisation_id:selected_organisation_id,kb_id:selected_knowledge_base_id,session_id:session_id,data:data}))
        handleClose()
    };



    if (!synset_show_form)
        return (<div/>);
    return (

        <div className="modal user-display" tabIndex="-1" role="dialog"
             style={{display: "inline", background: "#202731bb"}}>


            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                        <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>


                    {/*form starts*/}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div>
                                <div className="control-row">
                                    <span className="label-2">syn-set</span>
                                    <input className="text" {...register("word", {required: true})} />
                                    {errors.word && <span className=""> Syn-Set is required <br/></span>}
                                </div>

                                {wordCloudFields.map((item, index) => {
                                    return (
                                        <>
                                            <div className="control-row" key={index}>
                                                <span className="label-2">{"word cloud " + (index + 1)}</span>
                                                <span className="input-area ">
                                                <textarea {...register("wordCloudCsvList[" + index + "]", {required: true})}
                                                          className="input-area text-area" rows={3}/>
                                                    {/*{errors.wordCloudCsvList+[index] &&*/}
                                                    {/*    <span className=""> Syn-Set is required <br/></span>}*/}

                                                    {index > 1 &&
                                                        <div className="synset-trashcan">
                                                            <button onClick={() => deleteSyn(index)}
                                                                    className="btn text-danger btn-sm"
                                                                    title="remove syn">
                                                                remove
                                                            </button>
                                                        </div>
                                                    }
                                                </span>
                                            </div>
                                        </>
                                    )
                                })}



                                <div className="new-syn-button">
                                    <button onClick={() => newSyn()}
                                            className="btn btn-primary btn-sm"
                                            title="add a new syn">add a new syn item
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="modal-footer">
                            {/*<input type="hidden" {...register("lemma")} />*/}
                            <button className="btn btn-outline-secondary" onClick={handleClose}>Cancel</button>
                            <input type="submit" className={"btn btn-outline-primary"}/>
                        </div>
                    </form>
                    {/*form ends*/}

                    {/*{watch("word")}*/}
                </div>
            </div>
        </div>
    )
}