import React, {Component} from 'react';

import '../css/pagination.css';


export class Pagination extends Component {
    render() {
        let num_pages = this.props.count / this.props.rowsPerPage;
        if (num_pages !== parseInt("" + num_pages)) {
            num_pages += 1;
        }
        num_pages = parseInt("" + num_pages);

        return (
            <div className="d-flex justify-content-between mb-5 pb-5 pt-3" aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <div>
                            <span className="page-size-label">Show</span>
                            <span className="page-size-select mx-1">
                                <select className="form-select"
                                        onChange={(event) => this.props.onChangeRowsPerPage(event.target.value)}
                                        defaultValue={this.props.rowsPerPage} aria-label="set page-size">
                                    {
                                        this.props.rowsPerPageOptions.map((rows, index) => {
                                            return (<option value={rows} key={index}>{rows}</option>);
                                        })
                                    }
                                </select>
                            </span>
                        </div>
                    </li>
                    <li className="page-item">
                        <span className="page-display">
                            <label>{"page " + (this.props.page + 1) + " of " + num_pages}</label>
                            <label className="small fst-italic ms-1 opacity-50">{"(" + this.props.count + " items)"}</label>
                        </span>
                    </li>
                </ul>
                <ul className="pagination">
                    <li className={"page-item" + (this.props.page === 0 ? " disabled" : "")}
                        onClick={() => { if (this.props.page > 0) this.props.onChangePage(this.props.page - 1)}}>
                        <div className="page-link link-cursor" aria-label="Previous">
                            {/* <span aria-hidden="true">&laquo;&nbsp;</span> */}
                            <span className="sr-only">previous</span>
                        </div>
                    </li>
                    <li className={"page-item" + (this.props.page + 1 >= num_pages ? " disabled" : "")}
                        onClick={() => { if (this.props.page + 1 < num_pages) this.props.onChangePage(this.props.page + 1)}}>
                        <div className="page-link link-cursor" aria-label="Next">
                            <span className="sr-only">next</span>
                            {/* <span aria-hidden="true">&nbsp;&raquo;</span> */}
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

