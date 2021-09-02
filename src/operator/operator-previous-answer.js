import React, {Component} from 'react';

import '../css/operator.css';


export class OperatorPreviousAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            open: nextProps.open,
        })
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave(true);
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(false);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>operator-previous-answer.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded operator-display">

                        <div className="modal-header">Use Previous Answer?</div>
                        <div className="modal-body">
                            <div>SimSage has a previous answer to the question: <div className="questionStyle">{this.props.question}</div></div>
                            <div>SimSage's answer was:</div>
                            <div className="answerStyle">{this.props.answer}</div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block"  onClick={() => this.handleCancel()}>Cancel</button>
                            <button className="btn btn-primary btn-block"  onClick={() => this.handleSave()}>Use this Answer</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default OperatorPreviousAnswer;
