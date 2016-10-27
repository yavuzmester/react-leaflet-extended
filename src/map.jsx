"use strict";

const RL_Map = require("react-leaflet").Map;
const L = require("leaflet");
const {omit, isUndefined} = require("underscore");

class Map extends RL_Map {
    componentDidMount () {
        const props = omit(this.props, ["children", "className", "id", "style"]);
        this.leafletElement = L.map(this.state.id, props);
        super.componentDidMount();
        //this.setState({map: this.leafletElement});    //commented out
        if (!isUndefined(props.bounds)) {
            this.leafletElement.fitBounds(props.bounds, props.boundsOptions);
        }
    }

    componentDidUpdate(prevProps /*: object */) {
        //Do nothing here, as it seems we are better without it.
    }
}

module.exports = Map;

