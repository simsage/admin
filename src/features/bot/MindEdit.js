import React, {Component} from 'react';

import '../css/mind-edit.css';

const image_types = [".jpg", ".jpeg", ".png", ".gif", ".svg"];

export class MindEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,
            memory: props.memory,
            information: props.memory && props.memory.information ? props.memory.information : "",
            questionList: MindEdit.getQuestions(props.memory),
            links: this.linksToText(props.memory),
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,
            memory: props.memory,
            information: props.memory && props.memory.information ? props.memory.information : "",
            questionList: MindEdit.getQuestions(props.memory),
            links: this.linksToText(props.memory),
        })
    }
    handleSave() {
        if (this.state.onSave) {
            const memory = this.state.memory;
            memory.information = this.state.information;
            memory.questionList = [];
            for (const question of this.state.questionList) {
                if (question.trim().length > 0) {
                    memory.questionList.push(question.trim());
                }
            }
            memory.urlList = this.getLinks(this.state.links);
            memory.imageList = this.getImageLinks(this.state.links);
            this.state.onSave(memory);
        }
    }
    getLinks(links) {
        const list = [];
        for (const link of links.split('\n')) {
            const l = link.trim();
            if (l.length > 0 && !this.isImage(l)) {
                list.push(l.trim());
            }
        }
        return list;
    }
    linksToText(memory) {
        let str = "";
        if (memory) {
            if (memory.urlList) {
                for (const link of memory.urlList) {
                    const l = link.trim();
                    if (l.length > 0) {
                        str += l.trim() + "\n";
                    }
                }
            }
            if (memory.imageList) {
                for (const link of memory.imageList) {
                    const l = link.trim();
                    if (l.length > 0) {
                        str += l.trim() + "\n";
                    }
                }
            }
        }
        return str;
    }
    getImageLinks(links) {
        const list = [];
        for (const link of links.split('\n')) {
            const l = link.trim();
            if (l.length > 0 && this.isImage(l)) {
                list.push(l.trim());
            }
        }
        return list;
    }
    isImage(link) {
        if (link) {
            const l = link.toLowerCase();
            const i = l.lastIndexOf('.');
            if (i > 0) {
                const extension = l.substring(i);
                return image_types.includes(extension);
            }
        }
        return false;
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    static getLinks(memory) {
        let str = "";
        if (memory && memory.urlList) {
            for (const url of memory.urlList) {
                if (str.length > 0) {
                    str += "\n";
                }
                str += url;
            }
        }
        if (memory && memory.imageList) {
            for (const image of memory.imageList) {
                if (str.length > 0) {
                    str += "\n";
                }
                str += image;
            }
        }
        return str;
    }
    static getQuestions(memory) {
        let list = [];
        if (memory && memory.questionList) {
            for (const question of memory.questionList) {
                list.push(question.trim());
            }
        }
        while (list.length < 5) {
            list.push('')
        }
        return list;
    }
    setQuestion(index, text) {
        const question_list = this.state.questionList;
        question_list[index] = text;
        this.setState({questionList: question_list});
    }
    render() {
        if (this.state.has_error) {
            return <h1>mind-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Edit Memory</div>
                        <div className="modal-body">

                            {
                                this.state.questionList.map((question, i) => {
                                    return (
                                        <div className="edit-row" key={i}>
                                            <span className="label-area">{"question " + (i+1)}</span>
                                            <span className="input-area">
                                                    <input type="text" className="form-control"
                                                           autoFocus={i === 0}
                                                           onChange={(event) => this.setQuestion(i, event.target.value)}
                                                           placeholder={"question " + (i+1)}
                                                           value={question}
                                                    />
                                                </span>
                                        </div>
                                    )})
                            }

                            <div className="edit-row">
                                <span className="label-area">answer text</span>
                                <span className="input-area">
                                    <textarea className="input-area"
                                              onChange={(event) => this.setState({information: event.target.value})}
                                              placeholder="answer, or function (e.g. 'exec show_help person1 person2 date1')"
                                              rows={5}
                                              value={this.state.information}
                                    />
                                    </span>
                            </div>


                            <div className="edit-row">
                                <span className="label-area">links (one per line)</span>
                                <span className="input-area">
                                        <textarea className="input-area"
                                                  onChange={(event) => this.setState({links: event.target.value})}
                                                  placeholder="links"
                                                  rows={5}
                                                  value={this.state.links}
                                        />
                                    </span>
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

export default MindEdit;
