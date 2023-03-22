import React, {Component} from 'react';

import '../css/pagination.css';
import Api from "./api";


export class Pagination extends Component {
    render() {
        let num_pages = this.props.count / this.props.rowsPerPage;
        if (num_pages !== parseInt("" + num_pages)) {
            num_pages += 1;
        }
        num_pages = parseInt("" + num_pages);
        let count = parseInt("" + this.props.count);
        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={"page-item" + (this.props.page === 0 ? " disabled" : "")}
                        onClick={() => { if (this.props.page > 0) this.props.onChangePage(this.props.page - 1)}}>
                        <div className="page-link link-cursor" aria-label="Previous">
                            <span aria-hidden="true">&laquo;&nbsp;</span>
                            <span className="sr-only">previous</span>
                        </div>
                    </li>
                    <li className="page-item">
                        <span className="page-display">
                            <label>{"page " + Api.numberWithCommas(this.props.page + 1) + " of " + Api.numberWithCommas(num_pages) + ", for " + Api.numberWithCommas(count) + " items"}</label>
                        </span>
                    </li>
                    <li className="page-item">
                        <div>
                            <span className="page-size-label">page size</span>
                            <span className="page-size-select">
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
                    <li className={"page-item" + (this.props.page + 1 >= num_pages ? " disabled" : "")}
                        onClick={() => { if (this.props.page + 1 < num_pages) this.props.onChangePage(this.props.page + 1)}}>
                        <div className="page-link link-cursor" aria-label="Next">
                            <span className="sr-only">next</span>
                            <span aria-hidden="true">&nbsp;&raquo;</span>
                        </div>
                    </li>
                </ul>
            </nav>
        )
    }
}

