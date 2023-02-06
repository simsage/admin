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
import {Pagination} from "../../common/pagination";
import {loadSynonyms} from "../synonyms/synonymSlice";

export default function CategorizationHome() {

    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.categorizationReducer.data_status)

    const parent_category_list = useSelector((state) => state.categorizationReducer.category_list);

    const category_list = useSelector((state) => state.categorizationReducer.category_list);
    const total_count = useSelector((state) => state.categorizationReducer.total_count);
    const [page_size,setPageSize] = useState(useSelector((state)=>state.categorizationReducer.page_size))
    const [page,setPage] = useState(useSelector((state)=>state.categorizationReducer.page))
    const [filter, setFilter] = useState('');

    const dispatch = useDispatch();
        // console.log("category_list",load_data)

    let prev_set = category_list.slice(-1)[0]
    // console.log("prev_set",prev_set)
    let prev_cat_label = page != 0 ? prev_set['categorizationLabel']:null
    // console.log("prev_cat_label",prev_cat_label)

    let data = {
        session_id: session_id,
        organisation_id:selected_organisation_id,
        kb_id:selected_knowledge_base_id,
        prevCategorizationLabel: prev_cat_label,
        pageSize: page_size};

    // useEffect(()=>{
    //     // console.log("category_list",load_data)
    //     dispatch(loadCategorizations(data))
    // },[load_data === "load_now",page_size,page])

    function filterCategories() {
        let filteredGroup = []
        category_list && category_list.forEach( cat => {
            console.log('here',cat)
            if(cat.categorizationLabel.toLowerCase().includes(filter.toLowerCase())) {
                filteredGroup.push(cat)
            }
        })
        return filteredGroup
    }


    function getCategoryList(){
        const iterable_list = filter.length > 0 ? filterCategories() : category_list
        return iterable_list ? iterable_list : [];
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

    function handleSearchTextKeydown(event)
    {
        if (event.key === "Enter") {
            filterRecords();
        }
    }

    function filterRecords() {
        data.filter = filter
        // data.pageSize = page_size
        dispatch(loadCategorizations(data))
    }


    return (
        <div className="section px-5 pt-4">

            {/*<div className="synset-page">*/}
            {/*    <div className="d-flex w-100">*/}
            {/*        <div className="form-group me-2">*/}
            {/*            <input type="text" placeholder={"Filter..."} autoFocus={true} className={"form-control " + theme} value={filter} onChange={(e) => setFilter(e.target.value)}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    {*/}


            <div>
                {
                    isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">find category </span>
                        <span className="filter-find-text">
                            <input type="text" value={filter} autoFocus={true}
                                   className={"filter-text-width " + theme}
                                   onKeyDown={(event) => handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       setFilter(event.target.value);
                                   }}/>
                        </span> &nbsp;
                        <span className="filter-find-image">
                            <button className="btn btn-secondary"
                                    onClick={() => filterRecords()}
                                    src="../images/dark-magnifying-glass.svg" title="search" alt="search">search</button>
                        </span>
                    </div>
                }

                <br clear="both"/>
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
                                    console.log("getCategoryList: ",category)
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
                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
                            component="div"
                            count={total_count}
                            rowsPerPage={page_size}
                            page={page}
                            backIconButtonProps={{'aria-label': 'Previous Page',}}
                            nextIconButtonProps={{'aria-label': 'Next Page',}}
                            onChangePage={(page) => setPage(page)}
                            onChangeRowsPerPage={(rows) => setPageSize(rows)}
                        />
                    </div>
                }

            </div>
            <CategorizationEdit />
            <CategorizationDeleteAsk />
        </div>

    )
}
