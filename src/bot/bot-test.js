import React from 'react';

import {Api} from '../common/api'
import {BotSearchComponent} from "./bot-search-component";
import Comms from "../common/comms";


export class BotTest extends React.Component {
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
                                    "Remove Bot Entry", (action) => { this.deleteMemory(action) });
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
        this.props.openDialog("are you sure you want to remove all bot-items of this knowledge-base?",
            "Remove All Bot Items", (action) => { this.deleteAllMemories(action) });
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
    mindDump() {
        if (this.props.session && this.props.session.id)
            Comms.download_mind_dump(this.props.selected_organisation_id, this.props.selected_knowledgebase_id, this.props.session.id);
    }
    save(mindItem) {
        if (mindItem) {
            if (mindItem.expression.length > 0 && mindItem.actionList.length > 0) {
                this.props.saveMindItem(mindItem);
                this.setState({mind_edit: false});
            } else {
                this.props.setError("Error Saving Bot Entry", "bot-item must have an expression and actions");
            }
        } else {
            this.setState({mind_edit: false});
        }
    }
    render() {
        return (
            <div>

                {this.props.selected_knowledgebase_id &&
                    <BotSearchComponent onError={(title, err) => this.props.setError(title, err)}
                                        mindQuery={this.props.mindQuery}
                                        botQueryString={this.props.bot_query}
                                        setBotQueryString={this.props.setBotQueryString}
                                        queryResultList={this.props.queryResultList} />
                }

            </div>
        )
    }
}

export default BotTest;
