import React, {Component} from 'react';

const styles = {
    formContent: {
        marginTop: '50px',
        marginLeft: '50px',
        fontSize: '0.9em',
    },
};


export class CrawlerWordpress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            onSave: props.onSave,
            onError: props.onError,
        };

    }
    componentWillUnmount() {
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState({
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            });
        }
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            // dummy value in order to save
            this.state.onSave({crawlerType: "wordpress"});
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-wordpress.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>
                The WordPress crawler is an external entity controlled by the SimSage WordPress plugin.<br/>
                As such there are no properties to configure here, nor is there a schedule for SimSage to work to.
            </div>
        );
    }
}

export default CrawlerWordpress;
