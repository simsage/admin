import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeCategoryForm} from "./categorizationSlice";


export function CategorizationEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_category_form = useSelector( (state) => state.categorizationReducer.show_category_form)
    const selectedCategory = useSelector( (state) => state.categorizationReducer.edit);

    //Synonym details
    const [displayName, setDisplayName] = useState('');
    const [metadataName, setMetadataName] = useState('');
    const [category, setCategory] = useState('');
    const [wordCloud, setWordCloud] = useState('');



    // Grab synonym details if editing
    useEffect(()=> {
        if ( selectedCategory ) {
            console.log(`editing...`, selectedCategory)
            setDisplayName(selectedCategory.displayName);
            setMetadataName(selectedCategory.metadata);
            if (selectedCategory.categorizationList.length > 0){
                setCategory(selectedCategory.categorizationList[0].category);
                setWordCloud(selectedCategory.categorizationList[0].wordCloud);
            }

        }
    }, [show_category_form])

    function resetData () {
        setDisplayName('');
        setMetadataName('');
        setCategory('');
        setWordCloud('');
    }

    function handleClose(e){
        dispatch(closeCategoryForm());
        resetData();
    }



    const handleSave = () => {
        const session_id = session.id;
        console.log(`Editing...`, selectedCategory)
        const data = {
            "id": selectedCategory ? selectedCategory: "",

        }
        console.log(`Saving...`, data);
        // dispatch(updateSynonyms({session_id, organisation_id, knowledge_base_id, data}));
        // dispatch(closeSynonymForm());

    }


    if (show_category_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header">{selectedCategory ? "Edit Category" : "Add New Category"}</div>
                    <div className="modal-body">
                        <div className="tab-content">


                            <div className="control-row">
                                <span className="label-2">Display Name</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="Display Name"
                                                       value={displayName}
                                                       onChange={(event) => setDisplayName(event.target.value)}
                                                />
                                            </form>
                                        </span>
                            </div>
                            <div className="control-row">
                                <span className="label-2">Metadata Name</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="Metadata Name (key)"
                                                       value={metadataName}
                                                       onChange={(event) => setMetadataName(event.target.value)}
                                                />
                                            </form>
                                        </span>
                            </div>
                            <div className="control-row">
                                <span className="label-2">Description / Value</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="metadata value"
                                                       value={category}
                                                       onChange={(event) => setCategory(event.target.value)}
                                                />
                                            </form>
                                        </span>
                            </div>
                            <div className="control-row">
                                <span className="label-2">Word Cloud</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="Word cloud for identifying members of this category"
                                                       value={wordCloud}
                                                       onChange={(event) => setWordCloud(event.target.value)}
                                                />
                                            </form>
                                        </span>
                            </div>
                        </div>
                    </div>


                    <div className="modal-footer">
                        <button className="btn btn-primary btn-block" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
