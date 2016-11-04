"use strict";

const {PropTypes} = require("react");
const RL_TileLayer = require("@yavuzmester/react-leaflet").TileLayer;
const _ = require("underscore");

const propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    noWrap: PropTypes.bool,
    opacity: PropTypes.number
};

const defaultProps = {
    noWrap: true,
    opacity: 1
};

class TileLayer extends RL_TileLayer {
    name() {
        return this.props.name;
    }

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
