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