import React from 'react';

import {Api} from '../common/api'
import Grid from "@material-ui/core/Grid";
import {MindSearchComponent} from "./mind-search-component";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import Comms from "../common/comms";


const styles = {
    gridWidth: {
        width: '900px',
    },
    queryMindLabel: {
        marginTop: '12px',
        padding: '10px',
        color: '#555',
        float: 'right',
    },
};


export class MindTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mind_item: null,
            mind_edit: false,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
    }
    deleteMindItemAsk(mindItem) {
        if (mindItem) {
            this.props.openDialog("are you sure you want to remove id " + mindItem.id + "?<br/><br/>(" + mindItem.expression + ")",
                                    "Remove Mind Entry", (action) => { this.deleteMindItem(action) });
            this.setState({mind_item: mindItem});
        }
    }
    deleteMindItem(action) {
        if (action && Api.defined(this.state.mind_item)) {
            this.props.deleteMindItem(this.state.mind_item.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    deleteAllMindItemsAsk() {
        this.props.openDialog("are you sure you want to remove all mind-items of this knowledge-base?",
            "Remove All Mind Items", (action) => { this.deleteAllMindItems(action) });
    }
    deleteAllMindItems(action) {
        if (action) {
            this.props.deleteAllMindItems();
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getMindItems();
        }
    }
    static toAnswer(mindItem) {
        let str = "";
        if (mindItem && mindItem.actionList) {
            for (const action of mindItem.actionList) {
                if (action && action.action === "browser.write" && action.parameters) {
                    for (const param of action.parameters) {
                        str = str + param.replace(/<br \/>/g, "\n");
                    }
                }
            }
        }
        return str;
    }
    editMindItem(mindItem) {
        this.setState({mind_edit: true, mind_item: mindItem});
    }
    newMindItem() {
        this.setState({mind_edit: true, mind_item: {
                id: Api.createGuid(),
                preContext: "",
                postContext: "",
                expression: "",
                actionList: [],
                metadata: ""
            }
            });
    }
    mindDump() {
        window.open(Comms.get_mind_dump_url(this.props.selected_organisation_id, this.props.selected_knowledgebase_id), '_blank');
    }
    save(mindItem) {
        if (mindItem) {
            if (mindItem.expression.length > 0 && mindItem.actionList.length > 0) {
                this.props.saveMindItem(mindItem);
                this.setState({mind_edit: false});
            } else {
                this.props.setError("Error Saving Mind Entry", "mind-item must have an expression and actions");
            }
        } else {
            this.setState({mind_edit: false});
        }
    }
    getMindItemList() {
        if (this.props.mind_item_list) {
            return this.props.mind_item_list;
        }
        return [];
    }
    render() {
        return (
            <div>

                <Grid container spacing={1} style={styles.gridWidth}>

                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={12}>
                        <MindSearchComponent onError={(title, err) => this.props.setError(title, err)}
                                             botQuery={this.props.botQuery}
                                             botQueryString={this.props.bot_query}
                                             setBotQueryString={this.props.setBotQueryString}
                                             queryResultList={this.props.bot_query_result_list} />
                    </Grid>
                    }

                </Grid>

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        bot_query: state.appReducer.bot_query,
        bot_query_result_list: state.appReducer.bot_query_result_list,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(MindTest);

