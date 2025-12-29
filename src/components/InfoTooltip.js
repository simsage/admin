import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './InfoTooltip.css';

/**
 * A reusable info icon component that shows a tooltip on hover.
 * @param {object} props
 * @param {string} props.text - The text to display inside the tooltip.
 * @param {string} [props.placement] - The position of the tooltip (e.g., 'top', 'bottom', 'left', 'right').
 *
 * e.g.
 *   <InfoTooltip
 *      text="This is the helpful information you requested!"
 *      placement="right"
 *    />
 */
function InfoTooltip({ text, placement = 'right' }) {

    // This function renders the tooltip component.
    // The 'props' are passed in by OverlayTrigger to handle positioning.
    const renderTooltip = (props) => (
        <Tooltip className="my-wide-tooltip tooltip-inner" {...props}>
            {text}
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement={placement}
            delay={{ show: 250, hide: 400 }} // Adds a slight delay
            overlay={renderTooltip}
        >
            {/* This is the trigger element. We use a Bootstrap icon.
        The 'span' is necessary for OverlayTrigger to attach refs.
      */}
            <span style={{ cursor: 'help' }} className="ms-1">
        <i className="bi bi-info-circle-fill"></i>
      </span>
        </OverlayTrigger>
    );
}

export default InfoTooltip;
