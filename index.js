"use strict";

const Map = require("./src/map");
const TileLayer = require("./src/tile-layer");
const CanvasTileLayer = require("./src/canvas-tile-layer");
const GridLayer = require("./src/grid-layer");
const HeatLayer = require("./src/heat-layer");
const MarkerClusterGroupLayer = require("./src/marker-cluster-group-layer");
const ChoroplethLayer = require("./src/choropleth-layer");
const ChoroplethInfoControl = require("./src/choropleth-info-control");
const ChoroplethLegendControl = require("./src/choropleth-legend-control");

module.exports = {
    Map: Map,
    TileLayer: TileLayer,
    CanvasTileLayer: CanvasTileLayer,
    GridLayer: GridLayer,
    HeatLayer: HeatLayer,
    MarkerClusterGroupLayer: MarkerClusterGroupLayer,
    ChoroplethLayer: ChoroplethLayer,
    ChoroplethInfoControl: ChoroplethInfoControl,
    ChoroplethLegendControl: ChoroplethLegendControl
};
