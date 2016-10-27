"use strict";

const {PropTypes} = require("react");
const RL_TileLayer = require("react-leaflet").TileLayer;
const _ = require("underscore");

const propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    opacity: PropTypes.number
};

const defaultProps = {
    noWrap: false,  //to prevent glitch on the tile layer at the very right side
    opacity: 1
};

class TileLayer extends RL_TileLayer {
    constructor(props /*: object */, context /*: object */) {
        super(props, context);
    }

    name() {
        return this.props.name;
    }

    componentDidMount() {
        super.componentDidMount();

        //to prevent glitch on the tile layer at the very right side
        setTimeout(() => {
            this.leafletElement.setParams({noWrap: true});
        }, 300);
    }

    shouldComponentUpdate(nextProps /*: object */, nextState /*: object */) /*: boolean */ {
        return !_.isEqual(
            _.pick(this.props, Object.keys(propTypes)),
            _.pick(nextProps, Object.keys(propTypes))
        ) || !_.isEqual(this.state, nextState);
    }
}

TileLayer.propTypes = propTypes;
TileLayer.defaultProps = defaultProps;

module.exports = TileLayer;
