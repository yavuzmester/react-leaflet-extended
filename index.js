"use strict";

const ReactLeaflet = require("react-leaflet");
const Map = require("./src/map");
const TileLayer = require("./src/tile-layer");
const CanvasTileLayer = require("./src/canvas-tile-layer");
const GridLayer = require("./src/grid-layer");
const HeatLayer = require("./src/heat-layer");
const MarkerClusterGroupLayer = require("./src/marker-cluster-group-layer");

Object.assign(
    ReactLeaflet,
    {
        Map: Map,
        TileLayer: TileLayer,
        CanvasTileLayer: CanvasTileLayer,
        GridLayer: GridLayer,
        HeatLayer: HeatLayer,
        MarkerClusterGroupLayer: MarkerClusterGroupLayer
    }
);

module.exports = ReactLeaflet;
