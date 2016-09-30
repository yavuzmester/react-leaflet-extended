"use strict";

const {PropTypes} = require("react");
const RL_CanvasTileLayer = require("react-leaflet").CanvasTileLayer;
const _ = require("underscore");

const propTypes = {
    noWrap: PropTypes.bool,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            tx: PropTypes.number.isRequired,
            ty: PropTypes.number.isRequired,
            value: PropTypes.number.isRequired
        })
    ),
    opacity: PropTypes.number,
    hidden: PropTypes.bool
};

const defaultProps = {
    noWrap: true,
    data: [],
    opacity: 1,
    hidden: false
};

class CanvasTileLayer extends RL_CanvasTileLayer {
    tileCanvases() {
        return _.values(this.leafletElement._tiles);
    }
}

CanvasTileLayer.propTypes = propTypes;
CanvasTileLayer.defaultProps = defaultProps;

module.exports = CanvasTileLayer;
