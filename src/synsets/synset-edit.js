import React, {Component} from 'react';

import {Api} from '../common/api'

import '../css/synset.css';


export class SynSetEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            synSet: props.synSet,
            onSave: props.onSave,
            onError: props.onError,
            word: Api.defined(props.synSet) && Api.defined(props.synSet.word) ? props.synSet.word : "",
            cloud_list: SynSetEdit.getWordCloudList(props.synSet),
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    static getWordCloudList(synSet) {
        let list = [];
        if (Api.defined(synSet) && Api.defined(synSet.wordCloudCsvList)) {
            list = synSet.wordCloudCsvList;
        }
        while (list.length < 2) {
            list.push("");
        }
        return list;
    }
    handleSave() {
        if (this.state.onSave) {
            const syn = this.state.synSet;
            syn.word = this.state.word.trim();
            syn.wordCloudCsvList = this.state.cloud_list;

            const index = syn.word.indexOf(' ');
            if (index >= 0) {
                this.state.onError("syn-sets must be a single words without spaces.")
            } else {
                this.state.onSave(syn);
            }
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            synSet: props.synSet,
            onSave: props.onSave,
            onError: props.onError,
            word: Api.defined(props.synSet) && Api.defined(props.synSet.word) ? props.synSet.word : "",
            cloud_list: SynSetEdit.getWordCloudList(props.synSet),
        })
    }
    updateWC(index, str) {
        const cl = this.state.cloud_list;
        cl[index] = str;
        this.setState({cloud_list: cl});
    }
    newSyn() {
        const cl = this.state.cloud_list;
        cl.push("");
        this.setState({cloud_list: cl});
    }
    deleteSyn(index) {
        const newList = [];
        const cl = this.state.cloud_list;
        for (let i = 0; i < cl.length; i++) {
            if (i !== index) {
                newList.push(cl[i]);
            }
        }
        this.setState({cloud_list: newList});
    }
    render() {
        if (this.state.has_error) {
            return <h1>synset-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Edit syn-set "{this.state.word}"</div>
                        <div className="modal-body">
                            <div>

                                <div className="control-row">
                                    <span className="label-2">syn-set</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               autoFocus={true}
                                               onChange={(event) => this.setState({word: event.target.value})}
                                               placeholder={"syn-set"}
                                               value={this.state.word} />
                                    </span>
                                </div>




                                { this.state.cloud_list.map((item, index) => {
                                    return (
                                        <div className="edit-row" key={index}>
                                            <span className="label-area">{"word cloud " + (index+1)}</span>
                                            <span className="input-area synset-area-width">
                                                <textarea className="input-area synset-text-area-width"
                                                          onChange={(event) => this.updateWC(index, event.target.value)}
                                                          placeholder={"word-cloud for syn-set " + (index + 1)}
                                                          rows={2}
                                                          value={item}
                                                />
                                                {
                                                    index > 1 &&
                                                    <div className="synset-trashcan"
                                                         onClick={() => this.deleteSyn(index)}>
                                                        <img src={this.props.theme === 'light' ? "../images/delete.svg" : "../images/delete-dark.svg"} className="image-size"
                                                             title="remove syn" alt="remove syn"/>
                                                    </div>
                                                }
                                            </span>
                                        </div>)
                                })}

                                <div className="new-syn-button" onClick={() => this.newSyn()}>
                                    <img src={this.props.theme === 'light' ? "../images/add.svg" : "../images/add-dark.svg"} title="add a new syn item"
                                        className="image-size" alt="add a new syn"/>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={() => this.handleCancel()}>Cancel</button>
                            <button className="btn btn-primary btn-block" onClick={() => this.handleSave()}>Save</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default SynSetEdit;
