"use strict";

const {PropTypes} = require("react");
const {MapControl} = require("@yavuzmester/react-leaflet");
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

        leafletElement.onAdd = function() {
            const container = L.DomUtil.create("div", "geo-choropleth-info");
            leafletElement._container = container;
            reset(leafletElement, false);
            return container;
        };

        this.leafletElement = leafletElement;
    }

    update(where="" /*: ?string */, what="" /*: ?string */) {
        this.leafletElement._container.innerHTML = `
                <b>${where || ""}</b>
                <br/>
                <b>${what || ""}</b>
                <br/>
            `;

        L.DomUtil.removeClass(this.leafletElement._container, "visibility-hidden");
    }

    reset() {
        reset(this.leafletElement);
    }

    shouldComponentUpdate() /*: boolean */ {
        return false;
    }
}

ChoroplethInfoControl.defaultProps = defaultProps;

module.exports = ChoroplethInfoControl;
