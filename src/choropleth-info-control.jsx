"use strict";

const {PropTypes} = require("react");
const {MapControl} = require("react-leaflet");
const L = require("leaflet");

const defaultProps = {
    position: "bottomleft"
};

class ChoroplethInfoControl extends MapControl {
    componentWillMount() {
        const leafletElement = L.control(this.props);

        leafletElement.onAdd = function() {
            const container = L.DomUtil.create("div", "geo-choropleth-info visibility-hidden");
            container.innerHTML = "<br/><br/>";

            leafletElement._container = container;
            return container;
        };

        this.leafletElement = leafletElement;
    }

    update(where="" /*: string */, what="" /*: string */) {
        const visibility = where && what;

        this.leafletElement._container.innerHTML = `
                <b>${where || ""}</b>
                <br/>
                <b>${what || ""}</b>
                <br/>
            `;

        if (visibility) {
            L.DomUtil.removeClass(this.leafletElement._container, "visibility-hidden");
        }
        else {
            L.DomUtil.addClass(this.leafletElement._container, "visibility-hidden");
        }
    }

    reset() {
        this.leafletElement._container.innerHTML = "<br/><br/>";
        L.DomUtil.addClass(this.leafletElement._container, "visibility-hidden");
    }
}

ChoroplethInfoControl.defaultProps = defaultProps;

module.exports = ChoroplethInfoControl;
