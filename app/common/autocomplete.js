import React, { Component } from 'react';

import Downshift from 'downshift';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

// how many characters before we start calling back
const controlWidth = '500px';

const styles = {
    control: {
        float: 'left',
        width: 'calc(controlWidth - 20px)',
    },
    downShift: {
        marginTop: '-15px',
        float: 'left',
        width: controlWidth,
    },
    popover: {
        width: controlWidth,
    },
    pullDownBox: {
        float: 'right',
        marginTop: '10px',
        marginRight: '-22px',
    },
    pullDownImage: {
        width: '18px',
    },
};

// a simple auto-complete box with navigation, data-get calls and onSelect callbacks
// uses: "downshift": "^3.2.7"
// npm install --save downshift
export class AutoComplete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            has_error: false,
            id: props.id,

            // the text inside the text box
            label: props.label ? props.label : '',

            // callback when an item is selected (returns the data part below)
            onSelect: props.onSelect,

            // callback to get [{ label: 'display', data: {} }, ...]
            onFilter: props.onFilter,

            // the value to display in the box
            value: props.value ? props.value : '',

            // popper / menu values displayed y/n
            isOpen: false,

            // index of item selected in the drop down menu
            selectedIndex: -1,

            minTextSize: props.minTextSize >= 0 ? props.minTextSize : 2,

            // the list of values set by onFilter()
            suggestion_list: [],
        }
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    componentDidMount() {
    }
    UNSAFE_componentWillReceiveProps(next) {
        // see if we have data to start this dialog
        if (next !== null) {
            this.setState({
                id: next.id,
                label: next.label ? next.label : '',
                value: next.value ? next.value : '',
                minTextSize: next.minTextSize >= 0 ? next.minTextSize : 2,
                onSelect: next.onSelect,
                onFilter: next.onFilter,
            });
        }
    }
    // get text to display?
    getLookupData(text) {
        if (text.length >= this.state.minTextSize && this.state.onFilter) {
            this.state.onFilter(text, (list) => {
                this.setState({suggestion_list: list, value: text, isOpen: list.length > 0});
            });
        }
    }
    // get text to display?
    showAllData(force) {
        if (this.state.onFilter) {
            if (this.state.isOpen && !force) {
                this.closeControl();
            } else {
                this.state.onFilter('', (list) => {
                    this.setState({suggestion_list: list, isOpen: list.length > 0});
                });
            }
        }
    }
    closeControl() {
        // is value valid?
        const value = this.state.value;
        let exists = false;
        this.state.onFilter('', (list) => {
            for (const i in list) {
                if (list[i].label === value) {
                    exists = true;
                }
            }
        });
        if (!exists) {
            this.setState({suggestion_list: [], isOpen: false, value: ''});
            if (this.state.onSelect) {
                this.state.onSelect('', '');
            }
        } else {
            this.setState({suggestion_list: [], isOpen: false});
        }
    }
    static renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;
        return (
            <MenuItem
                {...itemProps}
                key={suggestion.label}
                selected={isHighlighted}
                component="div"
                style={{
                    height: '15px',
                    fontSize: '0.9em',
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.label}
            </MenuItem>
        );
    }
    select(selectedItem) {
        const list = this.state.suggestion_list;
        if (list && list.length > 0 && this.state.onSelect) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].label === selectedItem) {
                    this.state.onSelect(selectedItem, list[i].data);
                    this.setState({isOpen: false, selection_list: [], value: selectedItem})
                }
            }
        }
    }
    // keyboard handler for drop down menu list (cursor up/down controls + enter)
    handleKey(event) {
        const si = this.state.selectedIndex;
        const list = this.state.suggestion_list;
        if (list.length === 0) {
            this.setState({selectedIndex: -1})
        } else {
            if (event.keyCode === 13) {  // select
                if (si >= 0 && si < list.length) {
                    this.select(list[si].label);
                }
            } else if (event.keyCode === 38) { // arrow up
                if (si > 0) {
                    this.setState({selectedIndex: si - 1});
                } else {
                    this.setState({selectedIndex: 0});
                }
            } else if (event.keyCode === 40) { // arrow down
                if (si < 0) {
                    this.setState({selectedIndex: 0});
                } else {
                    if (si + 1 >= list.length) {
                        this.setState({selectedIndex: list.length - 1});
                    } else {
                        this.setState({selectedIndex: si + 1});
                    }
                }
            }
        }
    }
    render() {
        const self = this;
        const { inputValue, selectedItem } = this.state;
        if (this.state.has_error) {
            return (<h1>auto-complete.js: Something went wrong.</h1>);
        }
        return (
            <div style={styles.control}>

                <div style={styles.downShift}>
                    <Downshift id={this.state.id}
                               onSelect={(data) => this.select(data)} >
                        {({
                              getItemProps,
                              selectedItem,
                          }) => (
                            <div>
                                <TextField
                                    placeholder={this.state.label}
                                    inputProps={{fontSize: '30px'}}
                                    value={this.state.value}
                                    onClick={() => this.showAllData(true)}
                                    onBlur={() => this.closeControl()}
                                    spellCheck={false}
                                    onKeyDown={(event) => {
                                        if (this.state.isOpen)
                                            this.handleKey(event);
                                        else
                                            this.showAllData(true);
                                    }}
                                    onChange={(event) => {  this.setState({value: event.target.value});
                                        this.getLookupData(event.target.value);
                                    }}
                                    fullWidth={true}
                                />
                                {
                                    !this.state.isOpen &&
                                    <div style={styles.pullDownBox}>
                                        <img src="../images/pulldown.svg" style={styles.pullDownImage} alt="auto complete" />
                                    </div>
                                }
                                {
                                    this.state.isOpen &&
                                    <div style={styles.pullDownBox}>
                                        <img src="../images/pulldown-rotated.svg" style={styles.pullDownImage} alt="auto complete" />
                                    </div>
                                }
                                {this.state.isOpen &&
                                <Paper
                                    square
                                    style={{
                                        position: "absolute",
                                        zIndex: "999",
                                        marginTop: 8,
                                        paddingBottom: "20px",
                                        width: '500px',
                                        minHeight: '24px',
                                        maxHeight: '300px',
                                        overflowX: 'auto',
                                        overflowY: 'auto',
                                    }}
                                >
                                    {this.state.suggestion_list.map((suggestion, index) =>
                                        AutoComplete.renderSuggestion({
                                            suggestion,
                                            index,
                                            itemProps: getItemProps({
                                                item: suggestion.label,
                                                value: suggestion.label,
                                                data: suggestion.data
                                            }),
                                            highlightedIndex: this.state.selectedIndex,
                                            selectedItem,
                                        }),
                                    )}
                                </Paper>
                                }
                            </div>
                        )}
                    </Downshift>
                </div>

            </div>
        )
    }
}

export default AutoComplete;
