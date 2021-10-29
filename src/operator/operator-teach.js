import React, {Component} from 'react';

import '../css/operator.css';

export class OperatorTeach extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            links: '',
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.props.onSave) {
            let links = this.state.links.replace(/\n/g, ' ');
            links = links.replace(/\r/g, ' ');
            links = links.replace(/\t/g, ' ');
            this.props.onSave(true, links);
        }
    }
    handleCancel() {
        if (this.props.onSave) {
            this.props.onSave(false, '');
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>operator-teach.js: Something went wrong.</h1>;
        }
        let q = this.props.question;
        let a = this.props.answer;
        if (!this.props.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Teach SimSage?</div>
                        <div className="modal-body operator-teach">
                            <div>

                                <div><b>question</b></div>
                                <div>
                                    {q}
                                </div>
                                <div><b>answer</b></div>
                                <div>
                                    {a}
                                </div>

                                <br />
                                <div><b>links</b></div>
                                <div>
                                    <textarea className="input-area"
                                        onChange={(event) => this.setState({links: event.target.value})}
                                        placeholder="links (images and page-links, separated by commas or spaces)"
                                        rows={5}
                                        value={this.state.links}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block"  onClick={() => this.handleCancel()}>Cancel</button>
                            <button className="btn btn-primary btn-block"  onClick={() => this.handleSave()}>Save</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default OperatorTeach;
