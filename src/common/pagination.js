import React from 'react';

import '../css/pagination.css';
import CustomSelect from "../components/CustomSelect";


export function Pagination(props) {
    let num_pages = props.count / props.rowsPerPage;
    if (num_pages !== parseInt("" + num_pages)) {
        num_pages += 1;
    }

    num_pages = parseInt("" + num_pages);
    const options = props.rowsPerPageOptions.map(rows => ({key: rows, value: rows}));

    return (
        <div className="d-flex justify-content-between mt-4 mb-1 pt-1" aria-label="Page Navigation">
            <ul className="pagination">
                <li className="page-item">
                    {props.onChangeRowsPerPage &&
                        <div>
                            <span className="page-size-label">Show</span>
                            <span className="page-size-select mx-1">
                                <CustomSelect
                                    options={options}
                                    defaultValue={props.rowsPerPage}
                                    onChange={(value) => props.onChangeRowsPerPage(value)}
                                    label="Set Page Size"
                                    className=""
                                />
                            </span>
                        </div>
                    }
                </li>
                <li className="page-item">
                    <span className="page-display">
                        <label>{"page " + (props.page + 1) + " of " + num_pages}</label>
                        <label className="small fst-italic ms-1 opacity-50">{"(" + props.count + " items)"}</label>
                    </span>
                </li>
            </ul>
            <ul className="pagination">
                <li className={"page-item" + (props.page === 0 ? " disabled" : "")}
                    onClick={() => {
                        if (props.page > 0) props.onChangePage(props.page - 1)
                    }}>
                    <div className="page-link link-cursor" aria-label="Previous">
                        <span className="sr-only">previous</span>
                    </div>
                </li>
                <li className={"page-item" + (props.page + 1 >= num_pages ? " disabled" : "")}
                    onClick={() => {
                        if (props.page + 1 < num_pages) props.onChangePage(props.page + 1)
                    }}>
                    <div className="page-link link-cursor" aria-label="Next">
                        <span className="sr-only">next</span>
                    </div>
                </li>
            </ul>
        </div>
    )
}
