"use strict";

const {PropTypes} = require("react");
const RL_TileLayer = require("react-leaflet").TileLayer;
const _ = require("underscore");

const propTypes = {
    noWrap: PropTypes.bool,
    url: PropTypes.string.isRequired,
    opacity: PropTypes.number
};

const defaultProps = {
    noWrap: true,
    opacity: 1
};

class TileLayer extends RL_TileLayer {
    shouldComponentUpdate(nextProps /*: object */) /*: boolean */ {
        return !_.isEqual(
            _.pick(this.props, Object.keys(propTypes)),
            _.pick(nextProps, Object.keys(propTypes))
        );
    }
}

TileLayer.propTypes = propTypes;
TileLayer.defaultProps = defaultProps;

module.exports = TileLayer;
