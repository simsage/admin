import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeCategoryForm, updateCategorization} from "./categorizationSlice";
import CategorizationError from './CategorizationError';


export function CategorizationEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_category_form = useSelector( (state) => state.categorizationReducer.show_category_form)
    const selectedCategory = useSelector( (state) => state.categorizationReducer.edit);
    const error = useSelector((state) => state.categorizationReducer.error)
    //Synonym details
    const [categoryLabel, setCategoryLabel] = useState('');
    const [rule, setRule] = useState('');



    // Grab synonym details if editing
    useEffect(()=> {
        if ( selectedCategory ) {
            console.log(`editing...`, selectedCategory)
            setCategoryLabel(selectedCategory.categorizationLabel);
            setRule(selectedCategory.rule)
        }
    }, [show_category_form])

    function resetData () {
        setCategoryLabel('');
        setRule('')
    }

    const handleClose =  () => {
        dispatch(closeCategoryForm());
        resetData();
    }

    function handleError(){
        //Todo: Need to look into presenting response errors
    }


    const handleSave = () => {
        const session_id = session.id;
        console.log(`Editing...`, selectedCategory)
        const data = {
            "categorizationLabel": categoryLabel,
            "kbId": knowledge_base_id,
            "organisationId": organisation_id,
            "rule": rule
        }
         console.log(`Saving...`, data);
        dispatch(updateCategorization({session_id, data}));
        // if(error) {
        //     console.log('error')
        // }
        // else {
        //     handleClose()
        // }
        resetData();
    }

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
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto">
                            <div className="row mb-3">
                                <div className="control-row col-4">
                                    <span className="label-2 small">Category</span>
                                    <span className="text">
                                        <form>
                                            <input type="text" className="form-control"
                                                    autoComplete="false"
                                                    placeholder=""
                                                    value={categoryLabel}
                                                    onChange={(event) => setCategoryLabel(event.target.value)}
                                                    onKeyDown={(e) => {handleKeyDown(e)}}
                                            />
                                        </form>
                                    </span>
                                </div>
                                <div className="control-row col-8 mb-3">
                                    <span className="label-2 small">Rule</span>
                                    <span className="text">
                                        <form>
                                            <input type="text" className="form-control"
                                                    autoComplete="false"
                                                    placeholder="SimSage rule defining the matching criteria"
                                                    value={rule}
                                                    onChange={(event) => setRule(event.target.value)}
                                                    onKeyDown={(e) => {handleKeyDown(e)}}
                                            />
                                        </form>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer px-5 pb-4">
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
            <CategorizationError />
        </div>
    )
}
