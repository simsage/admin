import React, {Component} from 'react';

import Api from "../../../common/api";

import '../../../css/crawler.css';

// valid metadata drop-down values
const metadata_list = [
    {"key": "none", "display": null, "metadata": null, "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "author list", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "created date range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "last modified date ranges", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "document type", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "people list", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "hashtag list", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "location list", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "money range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "number range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
];











export class CrawlerMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // metadata set
            specific_json: props.specific_json ? props.specific_json : {},
        };

    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState({
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            });
        }
    }

    get_md_list() {
        return this.state && this.state.specific_json && this.state.specific_json.metadata_list ?
            this.state.specific_json.metadata_list : [];
    }
    construct_data(md_list) {
        // set the order field
        if (Api.defined(md_list)) {
            for (let i in md_list) {
                if (md_list.hasOwnProperty(i)) {
                    md_list[i].fieldOrder = "" + i;
                }
            }
        }
        return {
            ...this.props.specific_json, metadata_list: Api.defined(md_list) ? md_list : this.get_md_list()
        };
    }
    set_db(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].db1 = value;
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    set_db_extra(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].db2 = value;
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    set_md_type(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            let match_item = null;
            for (const item of metadata_list) {
                if (item.key === value) {
                    match_item = item;
                    break;
                }
            }
            if (match_item != null) {
                md_list[index] = JSON.parse(JSON.stringify(match_item));
                this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
                if (this.state.onSave) {
                    this.state.onSave(this.construct_data(md_list));
                }
            }
        }
    }

    setDisplayName(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].display = value;
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    setUserMetadataName1(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].metadata = value;
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    setSort(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].sort = value ? "true" : "false";
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    setValue(record, index, field_name, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index][field_name] = value;
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    setDefaultSort(record, index, direction, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].sortDefault = (value ? direction : "");
            for (const i in md_list) {
                if (""+i !== ""+index && md_list.hasOwnProperty(i)) {
                    md_list[i].sortDefault = "";
                }
            }
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    deleteMetadataItem(index) {
        const md_list = [];
        const i_index = '' + index
        const existing_md_list = this.get_md_list();
        for (let i in existing_md_list) {
            if (i !== i_index) {
                if (existing_md_list.hasOwnProperty(i))
                    md_list.push(existing_md_list[i]);
            }
        }
        this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
        if (this.state.onSave) {
            this.state.onSave(this.construct_data(md_list));
        }
    }
    addNewMetadataMapping() {
        const md_list = this.get_md_list();
        md_list.push(JSON.parse(JSON.stringify(metadata_list[0]))); // add a copy of item 0
        this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
        if (this.state.onSave) {
            this.state.onSave(this.construct_data(md_list));
        }
    }
    checkMetadataName(event) {
        // only allow valid characters to propagate for metadata names
        if ((event.key >= 'a' && event.key <= 'z') ||
            (event.key >= 'A' && event.key <= 'Z') ||
            (event.key >= '0' && event.key <= '9') || event.key === '-') {
            return true;
        } else {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }
    move_row_up(md, index) {
        if (index > 0) {
            const md_list = this.get_md_list();
            const temp = md_list[index-1];
            md_list[index-1] = md;
            md_list[index] = temp;
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    move_row_down(md, index) {
        const md_list = this.get_md_list();
        if (index + 1 < md_list.length) {
            const temp = md_list[index+1];
            md_list[index+1] = md;
            md_list[index] = temp;
            this.setState({specific_json: {...this.props.specific_json, metadata_list: md_list}});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }

    needs_metadata_field(md) {
        return (md.metadata !== null);
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-metadata-mapper.js: Something went wrong.</h1>;
        }
        const self = this;
        const theme = this.props.theme;
        const num_rows = this.get_md_list().length;
        return (
            <div className="crawler-page">

                <div className="instructions-label">All rows in order of UI.  Use 'actions' arrows to re-arrange existing rows.</div>

                <table className="table">

                    <thead>
                        <tr className='table-header'>
                            <th className="table-header metadata-column">data-type</th>
                            <th className="table-header display-column">UI display-name</th>
                            <th className="table-header metadata-field-column">metadata name</th>
                            <th className="table-header sort-field-column">sortable</th>
                            <th className="table-header action-field-column">actions</th>
                        </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td colSpan={3}>&nbsp;</td>
                    </tr>

                    {
                        this.get_md_list().map(function(md, index) {
                            return (<tr key={index}>

                                <td className="selector-column">
                                    <select className="form-select" onChange={(event) => { self.set_md_type(md, index, event.target.value) }}
                                            defaultValue={md.key} aria-label="select what kind of metadata field to use">
                                        {
                                            metadata_list.map((value, j) => {
                                                return (<option key={j} value={value.key}>{value.key}</option>)
                                            })
                                        }
                                    </select>
                                </td>

                                <td className="td-display-column">
                                    {
                                        md.display !== null &&
                                        <span>
                                            <input type="text"
                                                   className="theme metadata-text"
                                                   placeholder="UI display-name"
                                                   title="name displayed in the UI for this item"
                                                   value={md.display}
                                                   onChange={(event) => {self.setDisplayName(md, index, event.target.value)}}  />
                                        </span>
                                    }
                                </td>


                                <td className="td-align-top">
                                    {
                                        self.needs_metadata_field(md) &&
                                        <div className="td-md-field-width">
                                            <input type="text"
                                                   className="theme metadata-text"
                                                   placeholder="metadata name"
                                                   value={md.metadata}
                                                   title="metadata names should only contain 0..9, a..z, and A..Z"
                                                   onKeyDown={(event) => {return self.checkMetadataName(event)}}
                                                   onChange={(event) => {self.setUserMetadataName1(md, index, event.target.value)}}  />
                                        </div>
                                    }
                                    { md.sort === "true" &&
                                    <div>
                                        <input type="text"
                                               placeholder="sort descending UI text"
                                               className="theme metadata-text"
                                               value={md.sortDescText}
                                               title="The text to display for this field if a descending sort is selected of this type"
                                               onChange={(event) => {self.setValue(md, index, "sortDescText", event.target.value)}}  />
                                    </div>
                                    }
                                    { md.sort === "true" &&
                                    <div>
                                        <input type="text"
                                               className="theme metadata-text"
                                               placeholder="sort ascending UI text"
                                               value={md.sortAscText}
                                               title="The text to display for this field if an ascending sort is selected of this type"
                                               onChange={(event) => {self.setValue(md, index, "sortAscText", event.target.value)}}  />
                                    </div>
                                    }
                                    {md.sort === "true" &&
                                    <br />
                                    }
                                </td>

                                <td className="td-align-top">
                                    {md.sort !== "" &&
                                    <div className="td-sort-2" title="enable this category as an item used for sorting in the UI">
                                        <input type="checkbox"
                                            checked={md.sort === "true"}
                                            onChange={(event) => {
                                                self.setSort(md, index, event.target.checked);
                                            }}
                                            value="enable result sorting over this field?"
                                        />
                                        <span className="sort-label">sort</span>
                                    </div>
                                    }
                                    {md.sort === "true" &&
                                    <div className="td-sort-2" title="set this descending field as the default sort field for the UI">
                                        {'\u2190'}
                                        <input type="checkbox"
                                            checked={md.sortDefault === "desc"}
                                            onChange={(event) => {
                                                self.setDefaultSort(md, index, "desc", event.target.checked);
                                            }}
                                        />
                                    </div>
                                    }

                                    {md.sort === "true" &&
                                    <div className="td-sort-2" title="set this ascending field as the default sort field for the UI">
                                        {'\u2190'}
                                        <input type="checkbox"
                                            checked={md.sortDefault === "asc"}
                                            onChange={(event) => {
                                                self.setDefaultSort(md, index, "asc", event.target.checked);
                                            }}
                                        />
                                    </div>
                                    }
                                </td>

                                <td className="td-action">
                                    <span className="delete-box" onClick={() => self.deleteMetadataItem(index)} title="remove this metadata item">
                                        <img src={theme === 'light' ? "../images/delete.svg" : "../images/delete-dark.svg"} className="image-size" title="remove this metadata mapping" alt="remove this metadata mapping"/>
                                    </span>
                                    {index > 0 &&
                                    <span className="up-arrow" title="move row up (change UI ordering)"
                                          onClick={() => {
                                              self.move_row_up(md, index)
                                          }}>&#8679;</span>
                                    }
                                    {index + 1 < num_rows &&
                                    <span className="up-arrow" title="move row down (change UI ordering)"
                                          onClick={() => {
                                              self.move_row_down(md, index)
                                          }}>&#8681;</span>
                                    }
                                </td>

                            </tr>)
                        })
                    }

                    <tr>
                        <td colSpan={4}>&nbsp;</td>
                    </tr>

                    <tr>
                        <td colSpan={4} />
                        <td>
                            <div className="image-button" onClick={() => this.addNewMetadataMapping()}><img
                                className="image-size" src={theme === 'light' ? "../images/add.svg" : "../images/add-dark.svg"} title="add new metadata mapping"
                                alt="add new metadata mapping"/></div>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={4}>&nbsp;</td>
                    </tr>

                    </tbody>

                </table>
            </div>
        )
    }
}

export default CrawlerMetadata;
