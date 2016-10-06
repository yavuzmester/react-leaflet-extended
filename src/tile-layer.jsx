"use strict";

const {PropTypes} = require("react");
const RL_TileLayer = require("react-leaflet").TileLayer;

const propTypes = {
    name: PropTypes.string.isRequired,
    noWrap: PropTypes.bool,
    url: PropTypes.string.isRequired,
    opacity: PropTypes.number
};

const defaultProps = {
    noWrap: true,
    opacity: 1
};

class TileLayer extends RL_TileLayer {}

TileLayer.propTypes = propTypes;
TileLayer.defaultProps = defaultProps;

module.exports = TileLayer;
