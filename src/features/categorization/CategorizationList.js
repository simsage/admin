import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {loadCategorizations, showAddCategoryForm, showEditCategoryForm} from "./categorizationSlice";
import {CategorizationEdit} from "./CategorizationEdit";

export default function CategorizationHome() {

    const title = "Categorization";
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.categorizationReducer.data_status)



    const category_list = useSelector((state) => state.categorizationReducer.category_list);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(loadCategorizations({session_id: session_id, organisation_id:selected_organisation_id,kb_id:selected_knowledge_base_id}))

    },[load_data === 'load_now'])



    function getCategoryList(){
        return category_list?category_list:[];
    }

    function newCategory() {
        console.log('adding new category')
        dispatch(showAddCategoryForm(true));
    }

    function editCategory(category) {
        console.log('editing',category)
        dispatch(showEditCategoryForm({show:true, category:category}));
    }



    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    //legacy functions
    const empty_category = {
        metadata: "",
        displayName: "",
        categorizationList: [{category: "",wordCloud: ""}]
    }

    function create_empty_category() {
        return JSON.parse(JSON.stringify(empty_category));
    }


    function deleteCategoryAsk(category) {
        if (category && category.metadata) {
            this.props.openDialog("are you sure you want to remove category: " + category.metadata + "?",
                "Remove SynSet", (action) => {
                    this.deleteCategory(action)
                });
            this.setState({category: category});
        }
    }

    function deleteCategory(action) {
        if (action && this.state.category) {
            this.props.deleteCategory(this.state.category.metadata);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({category_edit: false, category: create_empty_category()});
    }



    function save(category) {
        if (category) {
            if (category.metadata.trim().length > 0 && category.displayName.trim().length > 0 && category.categorizationList.length > 0) {
                this.props.saveCategory(category);
                this.setState({category_edit: false, category: create_empty_category()});
            } else {
                this.props.setError("Error Saving document classification", "metadata, category, and/or word-cloud cannot be empty");
            }
        } else {
            this.setState({category_edit: false, category: create_empty_category()});
        }
    }




    return (
        <div className="section px-5 pt-4">
            <div className="synset-page">

                {
                    isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                            <tr className='table-header'>
                                <th className='table-header'>metadata</th>
                                <th className='table-header'>category</th>
                                <th className='table-header'>actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                getCategoryList().map((category, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <div className="synset-label">{category.metadata} </div>
                                            </td>
                                            <td>
                                                <div className="synset-label">{category.category}</div>
                                            </td>
                                            <td>
                                                <button className="link-button" title="edit syn-set"
                                                        onClick={() => editCategory(category)}>edit
                                                </button>&nbsp;
                                                <button className="link-button" title="remove syn-set"
                                                        onClick={() => deleteCategoryAsk(category)}>
                                                    remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td/>
                                <td/>
                                <td>
                                    {isVisible() &&
                                        <button className="btn btn-secondary" onClick={() => newCategory()}
                                                title="add a new categpry">new</button>
                                    }
                                </td>
                            </tr>

                            </tbody>

                        </table>

                    </div>
                }

            </div>
            <CategorizationEdit />
        </div>

    )
}
