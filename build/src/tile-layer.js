"use strict";

const { PropTypes } = require("react");
const RL_TileLayer = require("react-leaflet").TileLayer;
const _ = require("underscore");

const propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    opacity: PropTypes.number
};

const defaultProps = {
    noWrap: true,
    opacity: 1
};

class TileLayer extends RL_TileLayer {
    constructor(props /*: object */, context /*: object */) {
        super(props, context);
        this.state = { noWrap: true }; //to prevent glitch on the tile layer at the very right side
    }

    name() {
        return this.props.name;
    }

    componentDidMount() {
        super.componentDidMount();
        this.setState({ noWrap: false }); //to prevent glitch on the tile layer at the very right side
    }

    shouldComponentUpdate(nextProps /*: object */, nextState /*: object */) /*: boolean */{
        return !_.isEqual(_.pick(this.props, Object.keys(propTypes)), _.pick(nextProps, Object.keys(propTypes))) || !_.isEqual(this.state, nextState);
    }
}

TileLayer.propTypes = propTypes;
TileLayer.defaultProps = defaultProps;

module.exports = TileLayer;