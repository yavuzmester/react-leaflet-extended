"use strict";

const Map = require("./src/map");
const TileLayer = require("./src/tile-layer");
const CanvasTileLayer = require("./src/canvas-tile-layer");
const GridLayer = require("./src/grid-layer");
const HeatLayer = require("./src/heat-layer");
const MarkerClusterGroupLayer = require("./src/marker-cluster-group-layer");
const ChoroplethLayerGroup = require("./src/choropleth-layer-group");
const EditControl = require("./src/edit-control");

module.exports = {
    Map: Map,
    TileLayer: TileLayer,
    CanvasTileLayer: CanvasTileLayer,
    GridLayer: GridLayer,
    HeatLayer: HeatLayer,
    MarkerClusterGroupLayer: MarkerClusterGroupLayer,
    ChoroplethLayerGroup: ChoroplethLayerGroup,
    EditControl: EditControl
};
