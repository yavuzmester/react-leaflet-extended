"use strict";

const React = require("react"),
    {PropTypes} = React;
const L = require("leaflet");
require("leaflet-draw");
const {LayersControl} = require("react-leaflet");
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
    position: PropTypes.oneOf([
        "topright",
        "topleft",
        "bottomright",
        "bottomleft"
    ]).isRequired
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
    onMounted: _.noop
};

class EditControl extends LayersControl {
    options() {
        const {layerContainer} = this.context,
            {draw, position} = this.props;

        return Object.assign(
            {
                edit: {
                    featureGroup: layerContainer
                }
            },
            draw ? {
                draw: draw
            } : {},
            position ? {
                position: position
            } : {}
        );
    }

    componentWillMount() {
        const {
            onDrawCreated,
            onDrawEdited,
            onDrawMouseOver,
            onDrawMouseOut,
            onDrawsEdited,
            onDrawsEditStart,
            onDrawsEditStop,
            onDrawsDeleted,
            onDrawsDeleteStart,
            onDrawsDeleteStop,
            onMounted,
            } = this.props;

        const {map, layerContainer} = this.context;

        this.leafletElement = new L.Control.Draw(this.options());
        onMounted(this.leafletElement);

        map.on("draw:created", function(e) {
            const layer = e.layer;

            layerContainer.addLayer(e.layer);
            onDrawCreated.call(null, e);

            layer.on("mouseover", onDrawMouseOver);
            layer.on("mouseout", onDrawMouseOut);

            layer.on("editdrag", _.throttle(onDrawEdited, 400));
            layer.on("revert-edited", onDrawEdited);
            layer.on("revert-deleted", onDrawEdited);
        });

        map.on("draw:edited", onDrawsEdited);
        map.on("draw:editstart", onDrawsEditStart);
        map.on("draw:editstop", onDrawsEditStop);

        map.on("draw:deleted", onDrawsDeleted);
        map.on("draw:deletestart", onDrawsDeleteStart);
        map.on("draw:deletestop", onDrawsDeleteStop);
    }

    //TODO:
    //_createShapes(shapesToCreate=[] /*: ?array */) {
    //    shapesToCreate.forEach(shape => {
    //        var newShapeLayer;
    //        if (shape.options.type === "rectangle") {
    //            newShapeLayer = new L.Rectangle(L.LatLngBounds.toLatLngs(shape.bounds), shape.options);
    //        }
    //        else if (shape.options.type === "polygon") {
    //            newShapeLayer = new L.Polygon(L.LatLngBounds.toLatLngs(shape.bounds), shape.options);
    //        }
    //        else {
    //            console.error("shape.options.type is invalid");
    //        }
    //
    //        if (newShapeLayer) {
    //            newShapeLayer._leaflet_id = Number(shape.id);   //set the original id
    //            this.geoEditControl().addDraw(newShapeLayer);    //add draw
    //            this._bindShapeLayerEvents(newShapeLayer);      //bind shape layer events
    //        }
    //    });
    //}

    componentDidUpdate(prevProps /*: object */) {
        super.componentDidUpdate(prevProps);
        this.leafletElement.setDrawingOptions(this.props.draw);
    }

    isAnyToolbarEnabled() /*: boolean */ {
        const toolbars = Object.keys(this.leafletElement._toolbars).map(key => this.leafletElement._toolbars[key]);
        return toolbars.reduce((memo, t) => memo || t.enabled(), false);
    }
}

EditControl.propTypes = propTypes;
EditControl.defaultProps = defaultProps;

module.exports = EditControl;
