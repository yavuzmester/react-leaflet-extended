"use strict";

const {PropTypes} = require("react");
const RL_CanvasTileLayer = require("react-leaflet").CanvasTileLayer;

class CanvasTileLayer extends RL_CanvasTileLayer {
    tileCanvases() {
        return _.values(this.leafletElement._tiles);
    }
}

module.exports = CanvasTileLayer;
