"use strict";

const React = require("react"),
      { PropTypes } = React;
const L = require("leaflet");
L.Control.Draw = require("leaflet-draw");
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