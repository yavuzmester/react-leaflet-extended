"use strict";

const RL_Map = require("react-leaflet").Map;
const L = require("leaflet");

class Map extends RL_Map {
    componentDidUpdate(prevProps /*: object */) {
        const {bounds} = this.props;

        if (!L.latLngBounds(bounds).equals(prevProps.bounds)) {
            this.leafletElement.fitBounds(bounds);
        }
    }
}

module.exports = Map;
