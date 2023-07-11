import React from "react";
import { showAddSynonymForm} from "./synonymSlice";
import {useDispatch} from "react-redux";

export default function SynonymFilter() {

    const dispatch = useDispatch();

    function handleSearchFilter(event) {
        if(event.target.value.length > 2) {
        }
    }

    function handleAddNew(){
        dispatch(showAddSynonymForm(true));
    }


    return(
        <div className="d-flex justify-content-beteween w-50 mb-4">
            <div className="d-flex w-100">
                <div className="form-group me-2">
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