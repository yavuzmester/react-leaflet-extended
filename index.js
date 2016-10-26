"use strict";

const Map = require("./src/map");
const TileLayer = require("./src/tile-layer");
const CanvasTileLayer = require("./src/canvas-tile-layer");
const GridLayer = require("./src/grid-layer");
const HeatLayer = require("./src/heat-layer");
const MarkerClusterGroupLayer = require("./src/marker-cluster-group-layer");
const MarkerClusterGroupLayerContainer = require("./src/marker-cluster-group-layer-container");
const ChoroplethLayerContainer = require("./src/choropleth-layer-container");
const EditControl = require("./src/edit-control");

module.exports = {
    Map: Map,
    TileLayer: TileLayer,
    CanvasTileLayer: CanvasTileLayer,
    GridLayer: GridLayer,
    HeatLayer: HeatLayer,
    MarkerClusterGroupLayer: MarkerClusterGroupLayer,
    ChoroplethLayerContainer: ChoroplethLayerContainer,
    EditControl: EditControl
};
