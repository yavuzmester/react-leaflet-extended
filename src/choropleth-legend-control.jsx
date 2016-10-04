"use strict";

const {PropTypes} = require("react");
const {MapControl} = require("react-leaflet");
const L = require("leaflet");

const propTypes = {
    extents: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string.isRequired,
            extent: PropTypes.arrayOf(
                PropTypes.number.isRequired
            ).isRequired
        }).isRequired
    ),
    visibility: PropTypes.bool
};

const defaultProps = {
    position: "bottomleft",
    visibility: false
};

function update(legendControl={} /* object */, visibility=false /*: boolean */, extents=[] /*: array */) {
    if (visibility) {
        legendControl._container.innerHTML = extents.reduce((memo, e) => {
            return memo + `
                    <i style=${"background:" + e.color}></i> ${e.extent.join("-")} <br/>
                `;
        }, "");

        L.DomUtil.removeClass(legendControl._container, "visibility-hidden");
    }
    else {
        L.DomUtil.addClass(legendControl._container, "visibility-hidden");
    }
}

class ChoroplethLegendControl extends MapControl {
    componentWillMount() {
        const {position, visibility, extents} = this.props;

        const leafletElement = L.control({position: position});

        leafletElement.onAdd = function() {
            const container = L.DomUtil.create("div", "geo-choropleth-legend");
            leafletElement._container = container;
            update(leafletElement, visibility, extents);
            return container;
        };

        this.leafletElement = leafletElement;
    }

    componentWillReceiveProps(nextProps={} /*: object */) {
        const {visibility, extents} = nextProps;
        update(this.leafletElement, visibility, extents);
    }

    shouldComponentUpdate() {
        return false;
    }
}

ChoroplethLegendControl.propTypes = propTypes;
ChoroplethLegendControl.defaultProps = defaultProps;

module.exports = ChoroplethLegendControl;
