"use strict";

const {PropTypes} = require("react");
const {MapControl} = require("react-leaflet");
const L = require("leaflet");
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    visibility: PropTypes.bool
};

const defaultProps = {
    position: "bottomleft",
    visibility: false
};

function update(compassControl /* object */, visibility /*: boolean */) {
    compassControl._container.innerHTML = `<img src="images/compass.png"/>`;

    if (visibility) {
        L.DomUtil.removeClass(compassControl._container, "visibility-hidden");
    }
    else {
        L.DomUtil.addClass(compassControl._container, "visibility-hidden");
    }
}

class NwInfraCompassControl extends MapControl {
    componentWillMount() {
        const {position, visibility} = this.props;

        const leafletElement = L.control({position: position});

        leafletElement.onAdd = function() {
            const container = L.DomUtil.create("div", "geo-choropleth-legend");
            leafletElement._container = container;
            update(leafletElement, visibility);
            return container;
        };

        this.leafletElement = leafletElement;
    }

    componentDidUpdate(prevProps /*: object */) {
        super.componentDidUpdate(prevProps);

        const {visibility} = this.props;
        update(this.leafletElement, visibility);
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */ {
        return !shallowEqual(
            _.pick(this.props, Object.keys(propTypes)),
            _.pick(nextProps, Object.keys(propTypes))
        );
    }
}

NwInfraCompassControl.propTypes = propTypes;
NwInfraCompassControl.defaultProps = defaultProps;

module.exports = NwInfraCompassControl;
