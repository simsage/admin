import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
    loadCategorizations,
    showAddCategoryForm,
    showDeleteCategorizationForm,
    showEditCategoryForm
} from "./categorizationSlice";
import {CategorizationEdit} from "./CategorizationEdit";
import CategorizationDeleteAsk from "./CategorizationDeleteAsk";

export default function CategorizationHome() {


    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.categorizationReducer.data_status)



    const parent_category_list = useSelector((state) => state.categorizationReducer.category_list);
    const category_list = parent_category_list ? parent_category_list.categorizationList : []

    const dispatch = useDispatch();

    useEffect(()=>{
        console.log(load_data)
        dispatch(loadCategorizations({session_id: session_id, organisation_id:selected_organisation_id,kb_id:selected_knowledge_base_id, prevCategorizationLabel: null, pageSize: 5}))
    },[load_data === "load_now"])



    function getCategoryList(){
        return category_list ? category_list : [];
    }

    function newCategory() {
        console.log('adding new category')
        dispatch(showAddCategoryForm(true));
    }

    function editCategory(category) {
        console.log('editing',category)
        dispatch(showEditCategoryForm({show:true, category:category}));
    }

    function deleteCategoryAsk(category) {
        dispatch(showDeleteCategorizationForm({show:true, category:category}));
    }



    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
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
                                <th className='table-header'>Category</th>
                                <th className='table-header'>Rule</th>
                                <th className='table-header'>actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                getCategoryList().map((category, i) => {
                                    console.log(category)
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <div className="synset-label">{category.categorizationLabel} </div>
                                            </td>
                                            <td>
                                                <div className="synset-label">{category.rule}</div>
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
            <CategorizationDeleteAsk />
        </div>

    )
}
