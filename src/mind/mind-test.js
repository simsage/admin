import React from 'react';

import {Api} from '../common/api'
import {MindSearchComponent} from "./mind-search-component";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import Comms from "../common/comms";


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
    deleteMemoryAsk(mindItem) {
        if (mindItem) {
            this.props.openDialog("are you sure you want to remove id " + mindItem.id + "?<br/><br/>(" + mindItem.expression + ")",
                                    "Remove Mind Entry", (action) => { this.deleteMemory(action) });
            this.setState({mind_item: mindItem});
        }
    }
    deleteMemory(action) {
        if (action && Api.defined(this.state.mind_item)) {
            this.props.deleteMemory(this.state.mind_item.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    deleteAllMemoriesAsk() {
        this.props.openDialog("are you sure you want to remove all mind-items of this knowledge-base?",
            "Remove All Mind Items", (action) => { this.deleteAllMemories(action) });
    }
    deleteAllMemories(action) {
        if (action) {
            this.props.deleteAllMemories();
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
        Comms.download_mind_dump(this.props.selected_organisation_id, this.props.selected_knowledgebase_id);
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
    render() {
        return (
            <div>

                {this.props.selected_knowledgebase_id &&
                    <MindSearchComponent onError={(title, err) => this.props.setError(title, err)}
                                         mindQuery={this.props.mindQuery}
                                         botQueryString={this.props.bot_query}
                                         setBotQueryString={this.props.setBotQueryString}
                                         queryResultList={this.props.mind_result_list} />
                }

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        bot_query: state.appReducer.bot_query,
        mind_result_list: state.appReducer.mind_result_list,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(MindTest);

