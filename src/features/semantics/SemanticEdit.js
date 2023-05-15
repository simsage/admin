import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {closeSemanticForm, updateSemantics} from "./semanticSlice";
import {useForm} from "react-hook-form";

export function SemanticEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const show_semantic_form = useSelector((state) => state.semanticReducer.show_semantic_form);
    const selectedSemantic = useSelector( (state) => state.semanticReducer.edit);

    function handleClose(){
        dispatch(closeSemanticForm())
    }


    // on form submit
    const onSubmit = data => {
        dispatch(updateSemantics({session_id, organisation_id, knowledge_base_id, data}))
        dispatch(closeSemanticForm())
    }

    // set title
    const title = selectedSemantic ? "Edit Semantic" : "New Semantic"

    //Form Hook
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm();

    //set default values
    useEffect( () => {
        let defaultValues = {};
        defaultValues.word = selectedSemantic ? selectedSemantic.word : '';
        defaultValues.semantic = selectedSemantic ? selectedSemantic.semantic : '';

        reset({...defaultValues})
    }, [selectedSemantic, show_semantic_form, reset])


    if (show_semantic_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-header px-5 pt-4 bg-light">
                            <h4 className="mb-0">{title}</h4>
                        </div>
                        <div className="modal-body p-0">
                            <div className="tab-content px-5 py-4 overflow-auto">
                            <div className="row mb-3">
                                <div className="control-row col-6">
                                <div className={"mb-3 name" + (errors.word ? " error " : "")}>
                                    <label className="label-2 small">Word</label>
                                    <input
                                        className="form-control" {...register("word", {required: true})} />
                                    {errors.word &&
                                        <span className="text-danger fst-italic small">This field is required </span>}
                                </div>
                                </div>
                                <div className="control-row col-6">
                                <div className={"mb-3 name" + (errors.semantic ? " error " : "")}>
                                    <label className="label-2 small">Semantic</label>
                                    <input
                                        className="form-control" {...register("semantic", {required: true})} />
                                    {errors.semantic &&
                                        <span className="text-danger fst-italic small">This field is required </span>}
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <input type="submit" value="save" className={"btn btn-primary btn-block px-4"}/>
                    </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
