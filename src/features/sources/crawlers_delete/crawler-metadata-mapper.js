import React, {Component} from 'react';

import Api from "../../../common/api";

import '../../../css/crawler.css';


// valid metadata drop-down values
const metadata_list = [
    {"key": "none", "display": null, "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "author", "display": null, "metadata": "{author}", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "created", "display": null, "metadata": "{created}", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "last modified", "display": null, "metadata": "{lastmod}", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "title", "display": null, "metadata": "{title}", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "image from binary-blob", "display": null, "metadata": "binary-blob-image", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "image from base64", "display": null, "metadata": "base64-image", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "image from url", "display": null, "metadata": "url-image", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "category", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "two level category", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "number range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "monetary x 100 range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "monetary range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "star rating", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "select if true", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "created date range", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "last modified date ranges", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "false", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
    {"key": "csv string", "display": "", "metadata": "", "db1": "", "db2":"", "sort": "", "sortDefault": "", "sortAscText": "", "sortDescText": "", "sourceId": 0, "fieldOrder": 0},
];


export class CrawlerMetadataMapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,
            sourceId: 0,
            // metadata set
            specificJson: props.specificJson ? props.specificJson : {},
        };

    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState(this.construct_data({
                specificJson: nextProps.specificJson ? nextProps.specificJson : {},
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }

    get_md_list() {
        return this.state && this.state.specificJson && this.state.specificJson.metadata_list ?
            this.state.specificJson.metadata_list : [];
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
            ...this.props.specificJson, metadata_list: Api.defined(md_list) ? md_list : this.get_md_list()
        };
    }
    set_db(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].db1 = value;
            this.setState({specificJson: this.construct_data(md_list)});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    set_db_extra(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].db2 = value;
            this.setState({specificJson: this.construct_data(md_list)});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    set_md_type(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            // find the right item type in the preset list of items
            let match_item = null;
            for (const item of metadata_list) {
                if (item.key === value) {
                    match_item = item;
                    break;
                }
            }
            if (match_item != null) {
                md_list[index] = JSON.parse(JSON.stringify(match_item));
                this.setState({specificJson: this.construct_data(md_list)});
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
            this.setState({specificJson: this.construct_data(md_list)});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    setUserMetadataName1(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].metadata = value;
            this.setState({specificJson: this.construct_data(md_list)});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    setSort(record, index, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index].sort = value ? "true" : "false";
            this.setState({specificJson: this.construct_data(md_list)});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    setValue(record, index, field_name, value) {
        const md_list = this.get_md_list();
        if (index >= 0 && index < md_list.length) {
            md_list[index][field_name] = value;
            this.setState({specificJson: this.construct_data(md_list)});
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
            this.setState({specificJson: this.construct_data(md_list)});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    deleteMetadataItem(index) {
        const md_list = [];
        const i_index = '' + index
        const old_md_list = this.get_md_list();
        for (let i in old_md_list) {
            if (i !== i_index) {
                md_list.push(old_md_list[i]);
            }
        }
        this.setState({specificJson: this.construct_data(md_list)});
        if (this.state.onSave) {
            this.state.onSave(this.construct_data(md_list));
        }
    }
    addNewMetadataMapping() {
        const md_list = this.get_md_list();
        md_list.push(JSON.parse(JSON.stringify(metadata_list[0]))); // add a copy of item 0
        this.setState({specificJson: this.construct_data(md_list)});
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
            this.setState({specificJson: this.construct_data(md_list)});
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
            this.setState({specificJson: this.construct_data(md_list)});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data(md_list));
            }
        }
    }
    needs_metadata_field(md) {
        return md && md.key &&
            (   md.key === "category" ||
                md.key === "number range" ||
                md.key === "two level category" ||
                md.key === "monetary x 100 range" ||
                md.key === "monetary range" ||
                md.key === "star rating" ||
                md.key === "created date range" ||
                md.key === "last modified date ranges" ||
                md.key === "select if true" ||
                md.key === "csv string");
    }

    render() {
        if (this.state.has_error) {
            return <h1>crawler-metadata-mapper.js: Something went wrong.</h1>;
        }
        const self = this;
        const num_rows = this.get_md_list().length;
        const theme = this.props.theme;
        const source_id = (this.state && this.state.sourceId) ? this.state.sourceId : 0;
        return (
            <div className="crawler-page">

                <div className="instructions-label">All rows in order of UI.  Use 'actions' arrows to re-arrange existing rows.</div>

                <table className="table">

                    <thead>
                        <tr className='table-header'>
                            <th className="table-header metadata-column">data-type</th>
                            <th className="table-header db-field-column">source field</th>
                            <th className="table-header display-column">UI display-name</th>
                            <th className="table-header metadata-field-column">metadata name</th>
                            <th className="table-header sort-field-column">sortable</th>
                            <th className="table-header action-field-column">actions</th>
                        </tr>
                    </thead>

                    <tbody>

                    {
                        this.get_md_list().map(function(md, index) {
                            return (<tr key={index}>

                                <td className="selector-column">
                                    <select className="form-select metadata-field-column" onChange={(event) => { self.set_md_type(md, index, event.target.value) }}
                                            disabled={("" + source_id) !== "0"} aria-label="select what kind of metadata field to use"
                                            defaultValue={md.key}>
                                        {
                                            metadata_list.map((value, j) => {
                                                return (<option key={j} value={value.key}>{value.key}</option>)
                                            })
                                        }
                                    </select>
                                </td>

                                {md.key !== "two level category" &&
                                <td className="db-field-column">
                                    <input type="text"
                                        className="theme source-field-width"
                                        placeholder="source [field-name]"
                                        title="the source-name field to use for this category"
                                        value={md.db1}
                                        onChange={(event) => {
                                            self.set_db(md, index, event.target.value)
                                        }}
                                        />
                                </td>
                                }

                                {md.key === "two level category" &&
                                <td className="db-field-column">
                                    <input type="text"
                                        placeholder="level 1 [field-name]"
                                        className="theme source-field-width"
                                        value={md.db1}
                                        title="the first source field to use for this double category"
                                        onChange={(event) => {
                                            self.set_db(md, index, event.target.value)
                                        }}
                                        />
                                    <input type="text"
                                        placeholder="level 2 [field-name]"
                                        className="theme source-field-width"
                                        value={md.db2}
                                        title="the second source field to use for this double category"
                                        onChange={(event) => {
                                            self.set_db_extra(md, index, event.target.value)
                                        }}
                                        />
                                </td>
                                }


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
                                               className="theme metadata-text"
                                               placeholder="sort descending UI text"
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
                                        <img src={theme === 'light' ? "images/delete.svg" : "images/delete-dark.svg"} className="image-size" title="remove this metadata mapping" alt="remove this metadata mapping"/>
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
                        <td colSpan={5}>&nbsp;</td>
                    </tr>

                    <tr>
                        <td colSpan={5} />
                        <td>
                            <div className="image-button" onClick={() => this.addNewMetadataMapping()}><img
                                className="image-size" src={theme === 'light' ? "images/add.svg" : "images/add-dark.svg"} title="add new metadata mapping"
                                alt="add new metadata mapping"/></div>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={5}>&nbsp;</td>
                    </tr>

                    </tbody>

                </table>
            </div>
        );
    }
}

export default CrawlerMetadataMapper;
