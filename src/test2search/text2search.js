import React from 'react';

import {Text2SearchEdit} from "./text2search-edit";
import {Pagination} from "../common/pagination";

import '../css/text2search.css';


export class Text2Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text2search: {},
            text2search_edit: false,

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            // pagination
            page_size: 5,
            page: "",
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            openDialog: nextProps.openDialog,
            closeDialog: nextProps.closeDialog,
        });
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    changePage(page) {
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    getText2SearchList() {
        return this.props.text2search_list ? this.props.text2search_list : [];
    }
    deleteText2SearchAsk(text2search) {
        if (text2search && text2search.searchPart) {
            this.props.openDialog("are you sure you want to remove " + text2search.searchPart + "?",
                                    "Remove text2search", (action) => { this.deleteText2Search(action) });
            this.setState({text2search: text2search});
        }
    }
    deleteText2Search(action) {
        if (action && this.state.text2search && this.state.text2search.searchPart) {
            this.props.deleteText2Search(this.state.text2search.searchPart);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({text2search_edit: false, text2search: {}});
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getText2SearchList();
        }
    }
    handleTrySearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.tryText2Search();
        }
    }
    editText2Search(text2search) {
        this.setState({text2search_edit: true, text2search: text2search});
    }
    newTextToSearch() {
        this.setState({text2search_edit: true, text2search: {
            type: "", searchPart: "", matchWords: ""
            }});
    }
    save(text2search) {
        if (text2search && text2search.searchPart && text2search.type) {
            if (text2search.matchWords.length > 0) {
                this.props.saveText2Search(text2search.searchPart, text2search.type, text2search.matchWords);
                this.setState({text2search_edit: false, text2search: {}});
            } else {
                this.props.setError("Error Saving text-to-search", "invalid parameters");
            }
        } else {
            this.setState({text2search_edit: false, text2search: {}});
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
               this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    render() {
        const theme = this.props.theme;
        return (
            <div>
                <Text2SearchEdit open={this.state.text2search_edit}
                                 theme={theme}
                                 text2search={this.state.text2search}
                                 onSave={(item) => this.save(item)}
                                 onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&
                    <div className="text2search-section">
                        <div>
                            <span className="text2search-label">try text-to-search queries here</span>
                            <span className="try-text2search-box">
                                <input type="text" value={this.props.text2search_try_text} className="try-text2search-box"
                                       onKeyPress={(event) => this.handleTrySearchTextKeydown(event)}
                                       placeholder="press [enter] to try"
                                       onChange={(event) => {
                                           this.props.setText2SearchTryText(event.target.value)
                                       }}/>
                            </span>
                        </div>
                        <div className="text2search-result">
                            {this.props.text2search_try_reply ? this.props.text2search_try_reply : ""}
                        </div>
                    </div>
                }

                {
                    this.isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">find</span>
                        <span className="filter-find-text">
                            <input type="text" value={this.props.text2search_filter} autoFocus={true} className={"filter-text-width " + theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setText2SearchFilter(event.target.value)
                                   }}/>
                        </span>
                        <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.getText2SearchList()}
                                 src="../images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </span>
                    </div>
                }

                <br clear="both" />

                {
                    this.isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header text2search-column'>search part</th>
                                    <th className='table-header text2search-column'>search type</th>
                                    <th className='table-header text2search-column'>match words</th>
                                    <th className='table-header text2search-column'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.getText2SearchList().map((t2s, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="text2search-column-width-display">{t2s.searchPart}</div>
                                                </td>
                                                <td>
                                                    <div className="text2search-column-width-display">{t2s.type}</div>
                                                </td>
                                                <td>
                                                    <div className="text2search-column-width-display">{t2s.matchWords.join(", ")}</div>
                                                </td>
                                                <td>
                                                    <div className="link-button" onClick={() => this.editText2Search(t2s)}>
                                                        <img src="../images/edit.svg" className="image-size" title="edit text-to-search item" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteText2SearchAsk(t2s)}>
                                                        <img src="../images/delete.svg" className="image-size" title="remove text-to-search item" alt="remove"/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td className="action-column-width">
                                        {this.isVisible() &&
                                        <span onClick={() => this.newTextToSearch()} className="icon-left">
                                            <img className="image-size" src="../images/add.svg" title="new text-to-search item" alt="new"/>
                                        </span>
                                        }
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                        <Pagination
                            theme={theme}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.props.num_text2search}
                            rowsPerPage={this.props.text2search_page_size}
                            page={this.props.text2search_page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={(page) => this.props.setText2SearchPage(page)}
                            onChangeRowsPerPage={(rows) => this.props.setText2SearchPageSize(rows)}
                        />

                    </div>
                }

            </div>
        )
    }
}

export default Text2Search;
