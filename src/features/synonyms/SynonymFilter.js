import React, {useState} from "react";
import {filterSearch, showAddSynonymForm} from "./synonymSlice";
import {useDispatch, useSelector} from "react-redux";

export default function SynonymFilter(props) {

    const theme = null;
    const dispatch = useDispatch();

    // const [searchFilter,setSearchFilter] = useState('');

    function handleSearchFilter(event) {
        if(event.target.value.length > 2){
            console.log("handleSearchTextKeydown",event.target.value)
            // dispatch(filterSearch(event.target.value))
        }
        // if (e.key === "Enter" && this.props.selected_organisation_id) {
        //     this.props.getUsers(this.props.selected_organisation_id);
        // }
    }

    function handleAddNew(){
        dispatch(showAddSynonymForm(true));
    }


    return(
        <div className="d-flex justify-content-beteween w-50 mb-4">
            <div className="d-flex w-100">
                <div className="form-group me-2">
                    {/*<input type="text" placeholder={"Filter..."} value={searchFilter} autoFocus={true} className={"form-control " + theme}*/}
                    {/*       onKeyPress={(e) => handleSearchTextKeydown(e)}*/}
                    {/*       onChange={(e) => setSearchFilter(e.target.value)}/>*/}

                    <input onKeyUp={(event) => handleSearchFilter(event)} type="text"
                           placeholder={"Filter..."} className="form-control"/>

                </div>

            </div>

            <div className="form-group col ms-auto">
                <button className="btn btn-primary text-nowrap" onClick={() => handleAddNew()}>
                    + Add
                </button>
            </div>
        </div>
    );
}