
export function ProgressBar(props) {
    let width_1 = parseInt("" + ((props.percent / 100.0) * props.width));
    let width_2 = parseInt("" + (((100.0 - props.percent) / 100.0) * props.width));

    return (
        <div style={{"height": "14px", "width": props.width + "px", "marginTop": "5px", "cursor": "default"}}
             title={props.title}>
            <div style={{
                "position": "absolute", "height": "10px", "color": "#333",
                "fontSize": "8px", "zIndex": "1", "marginTop": "3px", "marginLeft": ((props.width / 2) - 4) + "px"
            }}>{props.percent + "%"}</div>
            <div style={{
                "borderTopLeftRadius": "3px", "borderBottomLeftRadius": "3px",
                "height": "14px", "width": width_1 + "px", "backgroundColor": "#50d060", "display": "inline-block"
            }}></div>
            <div style={{
                "borderTopRightRadius": "3px", "borderBottomRightRadius": "3px",
                "height": "14px", "width": width_2 + "px", "backgroundColor": "#d0d0d0", "display": "inline-block"
            }}></div>
        </div>
    )
}

