import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {closeCategoryForm, updateCategorization} from "./categorizationSlice";
import CategorizationError from './CategorizationError';
import {BsFilePdf} from "react-icons/bs";
import {useForm} from "react-hook-form";
import {addOrUpdate} from "../knowledge_bases/knowledgeBaseSlice";


export function CategorizationEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_category_form = useSelector( (state) => state.categorizationReducer.show_category_form)
    const selectedCategory = useSelector( (state) => state.categorizationReducer.edit);
    //Synonym details
    const [categoryLabel, setCategoryLabel] = useState('');
    const [rule, setRule] = useState('');



    //Form Hook
    const {register, handleSubmit, formState: {errors}, reset} = useForm();


    // Grab synonym details if editing
    useEffect(()=> {
        if ( selectedCategory ) {
            setCategoryLabel(selectedCategory.categorizationLabel);
            setRule(selectedCategory.rule)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_category_form])

    function resetData () {
        setCategoryLabel('');
        setRule('')
    }

    const handleClose =  () => {
        dispatch(closeCategoryForm());
        resetData();
    }

    // function handleError(){
    //     //Todo: Need to look into presenting response errors
    // }


    const handleSave = () => {
        const session_id = session.id;
        const data = {
            "categorizationLabel": categoryLabel,
            "kbId": knowledge_base_id,
            "organisationId": organisation_id,
            "rule": rule
        }
        dispatch(updateCategorization({session_id, data}));
        resetData();
    }


    useEffect(() => {
        let defaultValues = {};
        defaultValues.categorizationLabel = selectedCategory ? selectedCategory.categorizationLabel : '';
        defaultValues.rule = selectedCategory ? selectedCategory.rule : '';
        reset({...defaultValues});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, show_category_form]);


    //on submit store or update
    const onSubmit = data => {
        const session_id = session.id;
        data = {...data,
                kbId: knowledge_base_id,
                organisationId: organisation_id,
        }

        dispatch(updateCategorization({session_id, data}));
        resetData();
    };



    function handleKeyDown(e) {
        if(e.key === 'Enter') {
            e.preventDefault()
            handleSave()
        }
    }


    if (show_category_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{selectedCategory ? "Edit Category" : "New Category"}</h4>
                    </div>


                    <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto">
                            <div className="col-2 offset-10">
                                <a href="resources/super-search-syntax.pdf" id="dlsuperquery" target="_blank"
                                   title="Download the SimSage advanced query syntax guide"
                                   className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                                    <BsFilePdf size={25}/>
                                    <span className="me-2 mt-2"></span>Advanced Query<br/>Syntax Guide
                                </a>
                            </div>
                            <div className="row mb-3">
                                <div className="control-row col-4">
                                    <span className="label-2 small">Category</span>
                                    <span className="text">
                                            <input type="text" className="form-control"
                                                    autoComplete="false"
                                                    placeholder=""
                                                   {...register("categorizationLabel", {required: true})}
                                                    // value={categoryLabel}
                                                    // onChange={(event) => setCategoryLabel(event.target.value)}
                                                   // onKeyDown={(e) => {if(e.key === 'Enter') e.preventDefault()}}
                                            />
                                    </span>
                                    {errors.categorizationLabel &&
                                        <span className="text-danger fst-italic small">Category is required </span>}
                                </div>
                                <div className="control-row col-8 mb-3">
                                    <span className="label-2 small">SimSage advanced query language</span>
                                    <span className="text">
                                            <input type="text" className="form-control"
                                                    autoComplete="false"
                                                    placeholder="SimSage advanced query language expression (e.g. (word(test))  )"
                                                    title="SimSage advanced query language expression (e.g. (word(test))  )"
                                                   {...register("rule", {required: true})}
                                                    // value={rule}
                                                    // onChange={(event) => setRule(event.target.value)}
                                                   // onKeyDown={(e) => {if(e.key === 'Enter') e.preventDefault()}}
                                            />
                                    </span>
                                    {errors.rule &&
                                        <span className="text-danger fst-italic small">SimSage advanced query language is required </span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer px-5 pb-3">
                        <input type="submit" value="Save" className={"btn btn-primary px-4"}/>
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        {/*<button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>*/}
                    </div>
                    </form>
                </div>
            </div>
            <CategorizationError />
        </div>
    )
}
