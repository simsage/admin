import React, {Component} from 'react';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Api} from "../common/api";
import Checkbox from "@material-ui/core/Checkbox";

// valid metadata drop-down values
const metadata_list = [
    {"key": "none", "display": null, "field1": "", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "author", "display": null, "field1": "{author}", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "created", "display": null, "field1": "{created}", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "last modified", "display": null, "field1": "{lastmod}", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "title", "display": null, "field1": "{title}", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "image from binary-blob", "display": null, "field1": "binary-blob-image", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "image from base64", "display": null, "field1": "base64-image", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "image from url", "display": null, "field1": "url-image", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "category", "display": "", "field1": "", "db1": "", "db2":"", "sort": "false", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "two level category", "display": "", "field1": "", "db1": "", "db2":"", "sort": "", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "number range", "display": "", "field1": "", "db1": "", "db2":"", "sort": "false", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "monetary x 100 range", "display": "", "field1": "", "db1": "", "db2":"", "sort": "false", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "monetary range", "display": "", "field1": "", "db1": "", "db2":"", "sort": "false", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "star rating", "display": "", "field1": "", "db1": "", "db2":"", "sort": "false", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "select if true", "display": "", "field1": "", "db1": "", "db2":"", "sort": "false", "sort_default": "", "sort_asc": "", "sort_desc": ""},
    {"key": "csv string", "display": "", "field1": "", "db1": "", "db2":"", "sort": "false", "sort_default": "", "sort_asc": "", "sort_desc": ""},
];


const styles = {
    formContent: {
        marginTop: '20px',
        width: '98%',
    },
    instructionLabel: {
        fontSize: '10px',
        marginLeft: '20px',
    },
    table: {
        marginTop: '10px',
        marginLeft: '20px',
        borderSpacing: '0',
        border: '1px solid #aaaaaa',
        borderRadius: '5px',
    },
    tableHead: {
        backgroundColor: '#aaaaaa',
        color: '#ffffff',
    },
    db_field: {
        verticalAlign: 'top',
        width: '250px',
    },
    display: {
        width: '250px',
    },
    displayFieldWidth: {
    },
    tdDisplayFieldWidth: {
        verticalAlign: 'top',
        width: '200px',
    },
    tdSort: {
        verticalAlign: 'top',
    },
    sortLabel: {
        fontSize: '10px',
    },
    tdSort2: {
        float: 'left',
        height: '32px',
        marginLeft: '15px',
    },
    metadata_dropdown_box: {
        marginLeft: '10px',
        width: '220px',
        padding: '5px',
        verticalAlign: 'top',
        marginTop: '8px',
    },
    mdDropbox: {
        float: 'left',
        marginLeft: '10px',
        width: '220px',
        padding: '5px',
        verticalAlign: 'top',
    },
    metadata_field: {
        width: '200px',
        padding: '5px',
    },
    sort_field: {
        width: '100px',
        padding: '5px',
    },
    action_field: {
        width: '100px',
        padding: '5px',
    },
    metadata_dropdown: {
        marginLeft: '5px',
        width: '200px',
    },
    imageButton: {
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    addImage: {
        width: '25px',
        cursor: 'pointer',
        color: "green",
    },
    deleteBox: {
        marginTop: '-14px',
        color: '#888',
        float: 'left',
        cursor: 'pointer',
    },
    upDownArrow: {
        float: 'left',
        marginTop: '-16px',
        padding: '2px',
        fontSize: '26px',
        cursor: 'pointer',
    },
    deleteImage: {
        width: '24px',
    },
    dbFieldWidth: {
        width: '250px',
    },
    tdMetadataFieldName: {
        verticalAlign: 'top',
    },
    mdFieldWidth: {
        width: '200px',
    },
    tdAction: {
        float: 'left',
        marginTop: '8px',
        verticalAlign: 'top',
    }
};


export class CrawlerMetadataMapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // metadata set
            metadata_list: props.metadata_list ? props.metadata_list : [],
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
                metadata_list: nextProps.metadata_list,

                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.props.owner_data, metadata_list: Api.defined(data.metadata_list) ? data.metadata_list : this.state.metadata_list
        };
    }
    set_db(record, index, value) {
        const md_list = this.state.metadata_list;
        if (index >= 0 && index < md_list.length) {
            md_list[index].db1 = value;
            this.setState({metadata_list: md_list});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
            }
        }
    }
    set_db_extra(record, index, value) {
        const md_list = this.state.metadata_list;
        if (index >= 0 && index < md_list.length) {
            md_list[index].db2 = value;
            this.setState({metadata_list: md_list});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
            }
        }
    }
    set_md_type(record, index, value) {
        const md_list = this.state.metadata_list;
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
                this.setState({metadata_list: md_list});
                if (this.state.onSave) {
                    this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
                }
            }
        }
    }
    setDisplayName(record, index, value) {
        const md_list = this.state.metadata_list;
        if (index >= 0 && index < md_list.length) {
            md_list[index].display = value;
            this.setState({metadata_list: md_list});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
            }
        }
    }
    setUserMetadataName1(record, index, value) {
        const md_list = this.state.metadata_list;
        if (index >= 0 && index < md_list.length) {
            md_list[index].field1 = value;
            this.setState({metadata_list: md_list});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
            }
        }
    }
    setSort(record, index, value) {
        const md_list = this.state.metadata_list;
        if (index >= 0 && index < md_list.length) {
            md_list[index].sort = value ? "true" : "false";
            this.setState({metadata_list: md_list});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
            }
        }
    }
    setValue(record, index, field_name, value) {
        const md_list = this.state.metadata_list;
        if (index >= 0 && index < md_list.length) {
            md_list[index][field_name] = value;
            this.setState({metadata_list: md_list});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
            }
        }
    }
    setDefaultSort(record, index, direction, value) {
        const md_list = this.state.metadata_list;
        if (index >= 0 && index < md_list.length) {
            md_list[index].sort_default = (value ? direction : "");
            for (const i in md_list) {
                if (""+i !== ""+index && md_list.hasOwnProperty(i)) {
                    md_list[i].sort_default = "";
                }
            }
            this.setState({metadata_list: md_list});
            if (this.state.onSave) {
                this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
            }
        }
    }
    deleteMetadataItem(index) {
        const md_list = [];
        const i_index = '' + index
        for (let i in this.state.metadata_list) {
            if (i !== i_index) {
                if (this.state.metadata_list.hasOwnProperty(i))
                    md_list.push(this.state.metadata_list[i]);
            }
        }
        this.setState({metadata_list: md_list});
        if (this.state.onSave) {
            this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
        }
    }
    addNewMetadataMapping() {
        const md_list = this.state.metadata_list;
        md_list.push(JSON.parse(JSON.stringify(metadata_list[0]))); // add a copy of item 0
        this.setState({metadata_list: md_list});
        if (this.state.onSave) {
            this.state.onSave(this.construct_data({...this.state, metadata_list: md_list}));
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
            const md_list = this.state.metadata_list;
            const temp = md_list[index-1];
            md_list[index-1] = md;
            md_list[index] = temp;
            this.setState({metadata_list: md_list});
        }
    }
    move_row_down(md, index) {
        const md_list = this.state.metadata_list;
        if (index + 1 < md_list.length) {
            const temp = md_list[index+1];
            md_list[index+1] = md;
            md_list[index] = temp;
            this.setState({metadata_list: md_list});
        }
    }
    needs_metadata_field(md) {
        return (md.key === "category" || md.key === "number range" || md.key === "two level category" ||
                md.key === "monetary x 100 range" || md.key === "monetary range" || md.key === "star rating" ||
                md.key === "select if true" || md.key === "csv string");
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-metadata-mapper.js: Something went wrong.</h1>;
        }
        const self = this;
        const num_rows = this.state.metadata_list.length;
        return (
            <div style={styles.formContent}>

                <div style={styles.instructionLabel}>All rows in order of UI.  Use 'actions' arrows to re-arrange existing rows.</div>

                <table style={styles.table}>

                    <thead>
                        <tr style={styles.tableHead}>
                            <td style={styles.metadata_dropdown_box}>data-type</td>
                            <td style={styles.db_field}>source field</td>
                            <td style={styles.display}>UI display-name</td>
                            <td style={styles.metadata_field}>metadata name</td>
                            <td style={styles.sort_field}>sortable</td>
                            <td style={styles.action_field}>actions</td>
                        </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td colSpan={3}>&nbsp;</td>
                    </tr>

                    {
                        this.state.metadata_list.map(function(md, index) {
                            return (<tr key={index}>

                                <td style={styles.mdDropbox}>
                                    <Select
                                        value={md.key}
                                        style={styles.metadata_dropdown}
                                        title="select what kind of metadata field to use"
                                        onChange={(event) => { self.set_md_type(md, index, event.target.value) }}>
                                        {
                                            metadata_list.map((value, j) => {
                                                return (<MenuItem key={j} value={value.key}>{value.key}</MenuItem>)
                                            })
                                        }
                                    </Select>
                                </td>

                                {md.key !== "two level category" &&
                                <td style={styles.db_field}>
                                    <input type="text"
                                        placeholder="source [field-name]"
                                        title="the source-name field to use for this category"
                                        value={md.db1}
                                        onChange={(event) => {
                                            self.set_db(md, index, event.target.value)
                                        }}
                                        style={styles.dbFieldWidth}/>
                                </td>
                                }

                                {md.key === "two level category" &&
                                <td style={styles.db_field}>
                                    <input type="text"
                                        placeholder="level 1 [field-name]"
                                        value={md.db1}
                                        title="the first source field to use for this double category"
                                        onChange={(event) => {
                                            self.set_db(md, index, event.target.value)
                                        }}
                                        style={styles.dbFieldWidth}/>
                                    <input type="text"
                                        placeholder="level 2 [field-name]"
                                        value={md.db2}
                                        title="the second source field to use for this double category"
                                        onChange={(event) => {
                                            self.set_db_extra(md, index, event.target.value)
                                        }}
                                        style={styles.dbFieldWidth}/>
                                </td>
                                }


                                <td style={styles.tdDisplayFieldWidth}>
                                    {
                                        md.display !== null &&
                                        <span>
                                            <input type="text"
                                                placeholder="UI display-name"
                                                title="name displayed in the UI for this item"
                                                value={md.display}
                                                onChange={(event) => {self.setDisplayName(md, index, event.target.value)}}  />
                                        </span>
                                    }
                                </td>


                                <td style={styles.tdMetadataFieldName}>
                                {
                                    self.needs_metadata_field(md) &&
                                    <div style={styles.mdFieldWidth}>
                                        <input type="text"
                                            placeholder="metadata name"
                                            value={md.field1}
                                            title="metadata names should only contain 0..9, a..z, and A..Z"
                                            onKeyDown={(event) => {return self.checkMetadataName(event)}}
                                            onChange={(event) => {self.setUserMetadataName1(md, index, event.target.value)}}  />
                                    </div>
                                }
                                    { md.sort === "true" &&
                                    <div>
                                        <input type="text"
                                               placeholder="sort descending UI text"
                                               value={md.sort_desc}
                                               title="The text to display for this field if a descending sort is selected of this type"
                                               onChange={(event) => {self.setValue(md, index, "sort_desc", event.target.value)}}  />
                                    </div>
                                    }
                                    { md.sort === "true" &&
                                     <div>
                                         <input type="text"
                                                placeholder="sort ascending UI text"
                                                value={md.sort_asc}
                                                title="The text to display for this field if an ascending sort is selected of this type"
                                                onChange={(event) => {self.setValue(md, index, "sort_asc", event.target.value)}}  />
                                     </div>
                                    }
                                    {md.sort === "true" &&
                                        <br></br>
                                    }
                                </td>

                                <td style={styles.tdSort}>
                                    {md.sort !== "" &&
                                    <div style={styles.tdSort2} title="enable this category as an item used for sorting in the UI">
                                        <Checkbox
                                            checked={md.sort === "true"}
                                            onChange={(event) => {
                                                self.setSort(md, index, event.target.checked);
                                            }}
                                            value="enable result sorting over this field?"
                                            inputProps={{
                                                'aria-label': 'primary checkbox',
                                            }}
                                        />
                                        <span style={styles.sortLabel}>sort</span>
                                    </div>
                                    }
                                    {md.sort === "true" &&
                                    <div style={styles.tdSort2} title="set this descending field as the default sort field for the UI">
                                        {'\u2190'}
                                        <Checkbox
                                            checked={md.sort_default === "desc"}
                                            onChange={(event) => {
                                                self.setDefaultSort(md, index, "desc", event.target.checked);
                                            }}
                                            inputProps={{
                                                'aria-label': 'primary checkbox',
                                            }}
                                        />
                                        <span style={styles.sortLabel}>default</span>
                                    </div>
                                    }

                                    {md.sort === "true" &&
                                    <div style={styles.tdSort2} title="set this ascending field as the default sort field for the UI">
                                        {'\u2190'}
                                        <Checkbox
                                            checked={md.sort_default === "asc"}
                                            onChange={(event) => {
                                                self.setDefaultSort(md, index, "asc", event.target.checked);
                                            }}
                                            inputProps={{
                                                'aria-label': 'primary checkbox',
                                            }}
                                        />
                                        <span style={styles.sortLabel}>default</span>
                                    </div>
                                    }
                                </td>

                                <td style={styles.tdAction}>
                                    <span style={styles.deleteBox} onClick={() => self.deleteMetadataItem(index)} title="remove this metadata item">
                                        <img src="../images/delete.svg" style={styles.deleteImage} title="remove this metadata mapping" alt="remove this metadata mapping"/>
                                    </span>
                                    {index > 0 &&
                                    <span style={styles.upDownArrow} title="move row up (change UI ordering)"
                                          onClick={() => {
                                              self.move_row_up(md, index)
                                          }}>&#8679;</span>
                                    }
                                    {index + 1 < num_rows &&
                                    <span style={styles.upDownArrow} title="move row down (change UI ordering)"
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
                            <div style={styles.imageButton} onClick={() => this.addNewMetadataMapping()}><img
                                style={styles.addImage} src="../images/add.svg" title="add new metadata mapping"
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
