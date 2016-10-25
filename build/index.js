"use strict";

const { PropTypes } = require("react");
const RL_CanvasTileLayer = require("react-leaflet").CanvasTileLayer;
const _ = require("underscore");

class CanvasTileLayer extends RL_CanvasTileLayer {
    tileCanvases() {
        return _.values(this.leafletElement._tiles);
    }
}

module.exports = CanvasTileLayer;
"use strict";

const { PropTypes } = require("react");
const { MapControl } = require("react-leaflet");
const L = require("leaflet");

const defaultProps = {
    position: "bottomleft"
};

function reset(infoControl /* object */) {
    infoControl._container.innerHTML = "<br/><br/>";
    L.DomUtil.addClass(infoControl._container, "visibility-hidden");
}

class ChoroplethInfoControl extends MapControl {
    componentWillMount() {
        const leafletElement = L.control(this.props);

        leafletElement.onAdd = function () {
            const container = L.DomUtil.create("div", "geo-choropleth-info");
            leafletElement._container = container;
            reset(leafletElement, false);
            return container;
        };

        this.leafletElement = leafletElement;
    }

    update(where = "" /*: ?string */, what = "" /*: ?string */) {
        this.leafletElement._container.innerHTML = `
                <b>${ where || "" }</b>
                <br/>
                <b>${ what || "" }</b>
                <br/>
            `;

        L.DomUtil.removeClass(this.leafletElement._container, "visibility-hidden");
    }

    reset() {
        reset(this.leafletElement);
    }

    shouldComponentUpdate() /*: boolean */{
        return false;
    }
}

ChoroplethInfoControl.defaultProps = defaultProps;

module.exports = ChoroplethInfoControl;
"use strict";

const { PropTypes } = require("react");
const L = require("leaflet");
const { GeoJson } = require("react-leaflet");
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    geojson: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired
    })),
    categoryFromFeature: PropTypes.func,
    onFeatureMouseOver: PropTypes.func,
    onFeatureMouseOut: PropTypes.func,
    onFeatureClick: PropTypes.func
};

const defaultProps = {
    data: []
};

class ChoroplethLayer extends GeoJson {
    constructor(props /*: object */, context /*: object */) {
        super(props, context);

        this.style = this.style.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
    }

    componentWillMount() {
        const { geojson } = this.props,
              options = {
            style: this.style,
            onEachFeature: this.onEachFeature
        };

        this.leafletElement = L.geoJson(geojson, options);
    }

    style(feature /*: object */) /*: object */{
        const { data, categoryFromFeature } = this.props;

        const category = categoryFromFeature(feature),
              color = (data.find(d => d.category === category) || { color: undefined }).color;

        return {
            fillColor: color,
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.6
        };
    }

    onEachFeature(feature /*: object */, layer /*: object */) {
        const { onFeatureMouseOver, onFeatureMouseOut, onFeatureClick } = this.props;

        layer.on({
            mouseover: onFeatureMouseOver,
            mouseout: onFeatureMouseOut,
            click: onFeatureClick
        });
    }

    componentDidUpdate() {
        this.setStyle(this.style);
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */{
        return !shallowEqual(_.pick(this.props, Object.keys(propTypes)), _.pick(nextProps, Object.keys(propTypes)));
    }
}

ChoroplethLayer.propTypes = propTypes;
ChoroplethLayer.defaultProps = defaultProps;

module.exports = ChoroplethLayer;
"use strict";

const { PropTypes } = require("react");
const { MapControl } = require("react-leaflet");
const L = require("leaflet");
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    extents: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        extent: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    }).isRequired).isRequired,
    visibility: PropTypes.bool
};

const defaultProps = {
    position: "bottomleft",
    visibility: false
};

function update(legendControl /* object */, extents /*: array */, visibility /*: boolean */) {
    legendControl._container.innerHTML = extents.reduce((memo, e) => {
        return memo + `
                <i style=${ "background:" + e.color }></i> ${ e.extent.join("-") } <br/>
            `;
    }, "");

    if (visibility) {
        L.DomUtil.removeClass(legendControl._container, "visibility-hidden");
    } else {
        L.DomUtil.addClass(legendControl._container, "visibility-hidden");
    }
}

class ChoroplethLegendControl extends MapControl {
    componentWillMount() {
        const { position, extents, visibility } = this.props;

        const leafletElement = L.control({ position: position });

        leafletElement.onAdd = function () {
            const container = L.DomUtil.create("div", "geo-choropleth-legend");
            leafletElement._container = container;
            update(leafletElement, extents, visibility);
            return container;
        };

        this.leafletElement = leafletElement;
    }

    componentDidUpdate(prevProps /*: object */) {
        super.componentDidUpdate(prevProps);

        const { extents, visibility } = this.props;
        update(this.leafletElement, extents, visibility);
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */{
        return !shallowEqual(_.pick(this.props, Object.keys(propTypes)), _.pick(nextProps, Object.keys(propTypes)));
    }
}

ChoroplethLegendControl.propTypes = propTypes;
ChoroplethLegendControl.defaultProps = defaultProps;

module.exports = ChoroplethLegendControl;
"use strict";

const React = require("react"),
      { Component, PropTypes } = React;
const { LayerGroup } = require("react-leaflet");
const ChoroplethLayer = require("./choropleth-layer");
const ChoroplethInfoControl = require("./choropleth-info-control");
const ChoroplethLegendControl = require("./choropleth-legend-control");
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    name: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
        title: PropTypes.string
    }).isRequired).isRequired,
    geojson: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired
    })),
    extents: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        extent: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    })),
    visibility: PropTypes.bool
};

const defaultProps = {
    data: [],
    extents: [],
    visibility: false
};

class ChoroplethLayerContainer extends Component {
    name() {
        return this.props.name;
    }

    constructor(props /*: object */, context /*: object */) {
        super(props, context);

        this.categoryFromFeature = this.categoryFromFeature.bind(this);
        this.titleForCategory = this.titleForCategory.bind(this);
        this.onFeatureMouseOver = this.onFeatureMouseOver.bind(this);
        this.onFeatureMouseOut = this.onFeatureMouseOut.bind(this);
        this.onFeatureClick = this.onFeatureClick.bind(this);
    }

    render() {
        const { geojson, data, extents, visibility } = this.props;

        return React.createElement(
            LayerGroup,
            null,
            React.createElement(ChoroplethLayer, { ref: "geo-choropleth-layer",
                geojson: geojson,
                data: data,
                categoryFromFeature: this.categoryFromFeature,
                onFeatureMouseOver: this.onFeatureMouseOver,
                onFeatureMouseOut: this.onFeatureMouseOut,
                onFeatureClick: this.onFeatureClick }),
            React.createElement(ChoroplethInfoControl, { ref: "geo-choropleth-info-control" }),
            extents.length > 0 ? React.createElement(ChoroplethLegendControl, { extents: extents, visibility: visibility }) : ""
        );
    }

    geoChoroplethLayer() {
        return this.refs["geo-choropleth-layer"];
    }

    geoChoroplethInfoControl() {
        return this.refs["geo-choropleth-info-control"];
    }

    titleForCategory(category /*: string */) /*: string */{
        const { categories } = this.props;
        return categories.find(c => c.category === category).title || category;
    }

    categoryFromFeature(feature /*: object */) /*: string */{
        return Number(feature.properties.tags["ISO3166-2"].split("-")[1]).toString();
    }

    onFeatureMouseOver(e /*: object */) {
        const { data } = this.props;

        if (data.length > 0) {
            const layer = e.target,
                  feature = layer.feature,
                  category = this.categoryFromFeature(feature),
                  categoryTitle = this.titleForCategory(category),
                  value = (data.find(d => d.category === category) || { value: 0 }).value;

            layer.setStyle({
                weight: 5,
                color: "#666666",
                dashArray: "",
                fillOpacity: 0.8
            });

            layer.bringToFront();

            this.geoChoroplethInfoControl().update(categoryTitle, "" + value);
        }
    }

    onFeatureMouseOut(e /*: object */) {
        this.geoChoroplethLayer().leafletElement.resetStyle(e.target); //uses our style function to reset styles
        this.geoChoroplethInfoControl().reset();
    }

    onFeatureClick(e /*: object */) {
        e.target._map.fitBounds(e.target.getBounds());
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */{
        return !shallowEqual(_.pick(this.props, Object.keys(propTypes)), _.pick(nextProps, Object.keys(propTypes)));
    }
}

ChoroplethLayerContainer.propTypes = propTypes;
ChoroplethLayerContainer.defaultProps = defaultProps;

module.exports = ChoroplethLayerContainer;
"use strict";

const React = require("react"),
      { PropTypes } = React;
const L = require("leaflet");
require("leaflet-draw");
const { LayersControl } = require("react-leaflet");
const _ = require("underscore");

const propTypes = {
    onDrawCreated: PropTypes.func,
    onDrawEdited: PropTypes.func,
    onDrawMouseOver: PropTypes.func,
    onDrawMouseOut: PropTypes.func,
    onDrawsEdited: PropTypes.func,
    onDrawsEditStart: PropTypes.func,
    onDrawsEditStop: PropTypes.func,
    onDrawsDeleted: PropTypes.func,
    onDrawsDeleteStart: PropTypes.func,
    onDrawsDeleteStop: PropTypes.func,
    onMounted: PropTypes.func,
    draw: PropTypes.object.isRequired,
    shapes: PropTypes.arrayOf(PropTypes.shape({
        bounds: PropTypes.arrayOf(PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired
        }).isRequired).isRequired,
        color: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })),
    position: PropTypes.oneOf(["topright", "topleft", "bottomright", "bottomleft"]).isRequired
};

const defaultProps = {
    onDrawCreated: _.noop,
    onDrawEdited: _.noop,
    onDrawMouseOver: _.noop,
    onDrawMouseOut: _.noop,
    onDrawsEdited: _.noop,
    onDrawsEditStart: _.noop,
    onDrawsEditStop: _.noop,
    onDrawsDeleted: _.noop,
    onDrawsDeleteStart: _.noop,
    onDrawsDeleteStop: _.noop,
    onMounted: _.noop,
    shapes: []
};

class EditControl extends LayersControl {
    options() {
        const { layerContainer } = this.context,
              { draw, position } = this.props;

        return Object.assign({
            edit: {
                featureGroup: layerContainer
            }
        }, draw ? {
            draw: draw
        } : {}, position ? {
            position: position
        } : {});
    }

    componentWillMount() {
        const {
            onDrawCreated,
            onDrawsEdited,
            onDrawsEditStart,
            onDrawsEditStop,
            onDrawsDeleted,
            onDrawsDeleteStart,
            onDrawsDeleteStop,
            onMounted,
            shapes
        } = this.props;

        const { map, layerContainer } = this.context;

        this.leafletElement = new L.Control.Draw(this.options());
        onMounted(this.leafletElement);

        this._updateShapes();

        map.on("draw:created", e => {
            const shapeLayer = e.layer;

            layerContainer.addLayer(shapeLayer);
            this._bindEventsToShapeLayer(shapeLayer);

            onDrawCreated.call(null, e);
        });

        map.on("draw:edited", onDrawsEdited);
        map.on("draw:editstart", onDrawsEditStart);
        map.on("draw:editstop", onDrawsEditStop);

        map.on("draw:deleted", onDrawsDeleted);
        map.on("draw:deletestart", onDrawsDeleteStart);
        map.on("draw:deletestop", onDrawsDeleteStop);
    }

    _updateShapes() {
        const { shapes } = this.props,
              { layerContainer } = this.context;

        layerContainer.eachLayer(shapeLayer => {
            const shape = shapes.find(s => s.color === shapeLayer.options.color && s.type === shapeLayer.options.SHAPE_TYPE);

            if (!shape) {
                layerContainer.removeLayer(shapeLayer);
            } else {
                shapeLayer.setLatLngs(shape.bounds);
            }
        });

        shapes.forEach(shape => {
            const shapeLayer = _.values(layerContainer._layers).find(shapeLayer => {
                return shapeLayer.options.color === shape.color && shapeLayer.options.SHAPE_TYPE === shape.type;
            });

            if (!shapeLayer) {
                const ShapeLayer = shape.type === "rectangle" ? L.Rectangle : L.Polygon,
                      newShapeLayer = new ShapeLayer(shape.bounds, Object.assign({}, this.options().draw[shape.type].shapeOptions, {
                    color: shape.color
                }));

                layerContainer.addLayer(newShapeLayer);
                this._bindEventsToShapeLayer(newShapeLayer);
            }
        });
    }

    _bindEventsToShapeLayer(shapeLayer /*: object */) {
        const {
            onDrawEdited,
            onDrawMouseOver,
            onDrawMouseOut
        } = this.props;

        shapeLayer.on("mouseover", onDrawMouseOver);
        shapeLayer.on("mouseout", onDrawMouseOut);

        shapeLayer.on("editdrag", _.throttle(onDrawEdited, 400));
        shapeLayer.on("revert-edited", onDrawEdited);
        shapeLayer.on("revert-deleted", onDrawEdited);
    }

    componentDidUpdate(prevProps /*: object */) {
        super.componentDidUpdate(prevProps);
        this.leafletElement.setDrawingOptions(this.props.draw);
        this._updateShapes();
    }

    isAnyToolbarEnabled() /*: boolean */{
        const toolbars = Object.keys(this.leafletElement._toolbars).map(key => this.leafletElement._toolbars[key]);
        return toolbars.reduce((memo, t) => memo || t.enabled(), false);
    }
}

EditControl.propTypes = propTypes;
EditControl.defaultProps = defaultProps;

module.exports = EditControl;
"use strict";

const { PropTypes } = require("react");
const CanvasTileLayer = require("./canvas-tile-layer");
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    name: PropTypes.string.isRequired,
    noWrap: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
        tileX: PropTypes.number.isRequired,
        tileY: PropTypes.number.isRequired,
        tileText: PropTypes.string.isRequired
    })),
    opacity: PropTypes.number,
    visibility: PropTypes.bool
};

const defaultProps = {
    noWrap: true,
    data: [],
    opacity: 1,
    visibility: false
};

class GridLayer extends CanvasTileLayer {
    name() {
        return this.props.name;
    }

    tileText(tile /*: object */) /*: string */{
        const { data } = this.props;
        return (data.find(t => t.tileX === tile.x && t.tileY === tile.y) || { tileText: "" }).tileText;
    }

    draw() {
        const { visibility } = this.props;

        if (this.leafletElement._map) {
            this.leafletElement._reset();
            this.leafletElement._update();

            if (visibility) {
                this.tileCanvases().forEach(tc => this._drawTileCanvas(tc));
            }
        }
    }

    _drawTileCanvas(tileCanvas /*: object */) {
        const ctx = tileCanvas.getContext("2d"),
              tile = tileCanvas._tilePoint,
              tileText = this.tileText(tile);

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "white";
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.stroke();

        ctx.font = "10pt sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(tileText, 10, 256 - 10);
    }

    componentDidUpdate(prevProps /*: object */) {
        super.componentDidUpdate(prevProps);
        this.draw();
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */{
        return !shallowEqual(_.pick(this.props, Object.keys(propTypes)), _.pick(nextProps, Object.keys(propTypes)));
    }
}

GridLayer.propTypes = propTypes;
GridLayer.defaultProps = defaultProps;

module.exports = GridLayer;
"use strict";

const { PropTypes } = require("react");
const CanvasTileLayer = require("./canvas-tile-layer");
const hexToRgb = require("hex-rgb");
const _ = require("underscore");
const shallowEqual = require("shallowequal");
const createProxyCanvas = (width, height) => $("<canvas>").attr("width", width).attr("height", height)[0];

const propTypes = {
    name: PropTypes.string.isRequired,
    noWrap: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
        tileX: PropTypes.number.isRequired,
        tileY: PropTypes.number.isRequired,
        squaresInTile: PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            color: PropTypes.string,
            opacity: PropTypes.number
        })).isRequired
    })),
    tileWidthInSquares: PropTypes.number.isRequired,
    opacity: PropTypes.number,
    visibility: PropTypes.bool
};

const defaultProps = {
    noWrap: true,
    data: [],
    opacity: 1,
    visibility: false
};

function initContext(ctx /*: object */) {
    //clear the canvas
    const blankImageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
    ctx.putImageData(blankImageData, 0, 0);

    //smooth rendering
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
}

function drawImageDataToContext(ctx /*: object */, imageData /*: ImageData */) {
    const scaleRatio = ctx.canvas.width / imageData.width;

    if (scaleRatio === 1) {
        ctx.putImageData(imageData, 0, 0);
    } else {
        const proxyCanvas = createProxyCanvas(imageData.width, imageData.height),
              proxyCanvasCtx = proxyCanvas.getContext("2d");

        proxyCanvasCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(proxyCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}

class HeatLayer extends CanvasTileLayer {
    name() {
        return this.props.name;
    }

    squaresInTile(tile /*: object */) /*: array<object> */{
        const { data } = this.props;
        return (data.find(t => t.tileX === tile.x && t.tileY === tile.y) || { squaresInTile: [] }).squaresInTile;
    }

    draw() {
        const { visibility } = this.props;

        if (this.leafletElement._map) {
            this.leafletElement._reset();
            this.leafletElement._update();

            if (visibility) {
                this.tileCanvases().forEach(tc => this._drawTileCanvas(tc));
            }
        }
    }

    _drawTileCanvas(tileCanvas /*: object */) {
        const ctx = tileCanvas.getContext("2d");
        initContext(ctx);
        const imageData = this._prepareTileImageData(tileCanvas);
        drawImageDataToContext(ctx, imageData);
    }

    _prepareTileImageData(tileCanvas /*: object */) /*: ImageData */{
        const { tileWidthInSquares } = this.props;

        const ctx = tileCanvas.getContext("2d"),
              blankImageData = ctx.createImageData(tileWidthInSquares, tileWidthInSquares),
              tile = tileCanvas._tilePoint,
              squaresInTile = this.squaresInTile(tile);

        return squaresInTile.reduce((memo, s) => {
            if (s.color && s.opacity) {
                const idx = (memo.height - 1 - s.y) * memo.width + s.x,
                      [r, g, b] = hexToRgb(s.color),
                      a = Math.max(0, Math.min(255, s.opacity)) * 255;

                memo.data[idx * 4] = r;
                memo.data[idx * 4 + 1] = g;
                memo.data[idx * 4 + 2] = b;
                memo.data[idx * 4 + 3] = a;
            }

            return memo;
        }, blankImageData);
    }

    componentDidUpdate(prevProps /*: object */) {
        super.componentDidUpdate(prevProps);
        this.draw();
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */{
        return !shallowEqual(_.pick(this.props, Object.keys(propTypes)), _.pick(nextProps, Object.keys(propTypes)));
    }
}

HeatLayer.propTypes = propTypes;
HeatLayer.defaultProps = defaultProps;

module.exports = HeatLayer;
"use strict";

const RL_Map = require("react-leaflet").Map;
const L = require("leaflet");

class Map extends RL_Map {
    componentDidUpdate(prevProps /*: object */) {
        //Do nothing here, as it seems we are better without it.
    }
}

module.exports = Map;
"use strict";

const { PropTypes } = require("react");
const L = require("leaflet");
require("leaflet.markercluster");
const RL_MapLayer = require("react-leaflet").MapLayer;
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired
    }).isRequired).isRequired
};

const defaultProps = {
    data: []
};

const markerIcon = L.icon({
    iconUrl: "https://asmaloney.com/wp-content/themes/asmaloney/maps_cluster/images/pin24.png",
    iconRetinaUrl: "https://asmaloney.com/wp-content/themes/asmaloney/maps_cluster/images/pin48.png",
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

function datumToMarker(datum /*: object */) /*: L.Marker */{
    const marker = L.marker([datum.lat, datum.lng], { icon: markerIcon }),
          popupHtml = datumToPopupHtml(datum);

    return marker.bindPopup(popupHtml);
}

function datumToPopupHtml(datum /*: object */) /*: string */{
    return Object.keys(datum).reduce((memo, key) => {
        if (key !== "lat" && key !== "lng") {
            return memo + `<br/><b>${ key }:</b>  ${ datum[key] }`;
        } else {
            return memo;
        }
    }, "");
}

class MarkerClusterGroupLayer extends RL_MapLayer {
    name() {
        return this.props.name;
    }

    componentWillMount() {
        super.componentWillMount();
        this.leafletElement = L.markerClusterGroup();
    }

    componentDidMount() {
        super.componentDidMount();

        this.leafletElement.addLayers(this.props.data.map(d => datumToMarker(d)));
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */{
        return !shallowEqual(_.pick(this.props, Object.keys(propTypes)), _.pick(nextProps, Object.keys(propTypes)));
    }
}

MarkerClusterGroupLayer.propTypes = propTypes;
MarkerClusterGroupLayer.defaultProps = defaultProps;

module.exports = MarkerClusterGroupLayer;
"use strict";

const { PropTypes } = require("react");
const RL_TileLayer = require("react-leaflet").TileLayer;
const _ = require("underscore");

const propTypes = {
    name: PropTypes.string.isRequired,
    noWrap: PropTypes.bool,
    url: PropTypes.string.isRequired,
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

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */{
        return !_.isEqual(_.pick(this.props, Object.keys(propTypes)), _.pick(nextProps, Object.keys(propTypes)));
    }
}

TileLayer.propTypes = propTypes;
TileLayer.defaultProps = defaultProps;

module.exports = TileLayer;
