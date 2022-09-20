import {useDispatch, useSelector} from "react-redux";
import {closeForm} from "./synsetSlice";
import {useForm} from "react-hook-form";
import React, {useEffect} from "react";
import {addOrUpdate} from "../knowledge_bases/knowledgeBaseSlice";


export default function SynsetForm() {
    const dispatch = useDispatch();
    const theme = null;

    const handleClose = () => {
        console.info("handleClose")
        dispatch(closeForm());
    }

    const selected_synset = useSelector((state) => state.synsetReducer.selected_synset)

    console.log("data", selected_synset)
    console.log("data", selected_synset.word)

    // set title
    const title = (selected_synset) ? "Edit syn-set " + selected_synset.word : "Add new syn-set";
    const synset_show_form = useSelector((state) => state.synsetReducer.show_data_form)

    //Form Hook
    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();


    //set default value when selected_synset or synset_show_form changes
    useEffect(() => {
        let defaultValues = {};

        reset({...defaultValues});
    }, [selected_synset, synset_show_form]);


    //on submit store or update
    const onSubmit = data => {
        // data = {...data}
        console.log("data", data)
        // dispatch(addOrUpdate({session_id: session.id, data: data}))
        handleClose()
    };


    // copied from edit page
    function updateWC(index, str) {
        const cl = this.state.cloud_list;
        cl[index] = str;
        this.setState({cloud_list: cl});
    }
    function newSyn() {
        const cl = this.state.cloud_list;
        cl.push("");
        this.setState({cloud_list: cl});
    }
    function deleteSyn(index) {
        const newList = [];
        const cl = this.state.cloud_list;
        for (let i = 0; i < cl.length; i++) {
            if (i !== index) {
                newList.push(cl[i]);
            }
        }
        this.setState({cloud_list: newList});
    }





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
                                    <input {...register("word", {required: true})} />
                                    {errors.word && <span className=""> Syn-Set is required <br/></span>}
                                </div>


                                { selected_synset.wordCloudCsvList.map((item, index) => {
                                    return (
                                        <div className="edit-row" key={index}>
                                            <span className="label-2">{"word cloud " + (index+1)}</span>
                                            <span className="input-area synset-area-width">
                                                <textarea className="input-area"
                                                          onChange={(event) => updateWC(index, event.target.value)}
                                                          placeholder={"word-cloud for syn-set " + (index + 1)}
                                                          rows={2}
                                                          value={item}
                                                />
                                                {
                                                    index > 1 &&

                                                    <div className="synset-trashcan" >

                                                        <button onClick={() => deleteSyn(index)}
                                                                className="btn text-danger btn-sm"
                                                                title="remove syn">remove
                                                        </button>

                                                    </div>
                                                }
                                            </span>
                                        </div>)
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
                            <button className="btn btn-outline-secondary" onClick={handleClose}>Cancel</button>
                            <input type="submit" className={"btn btn-outline-primary"}/>
                        </div>
                    </form>
                    {/*form ends*/}


                </div>
            </div>
        </div>
    )
}