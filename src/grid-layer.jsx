"use strict";

const {PropTypes} = require("react");
const CanvasTileLayer = require("./canvas-tile-layer");
const _ = require("underscore");
const shallowEqual = require("shallowequal");

const propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            tileX: PropTypes.number.isRequired,
            tileY: PropTypes.number.isRequired,
            tileText: PropTypes.string.isRequired
        })
    ),
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

    tileText(tile /*: object */) /*: string */ {
        const {data} = this.props;
        return (data.find(t => t.tileX === tile.x && t.tileY === tile.y) || {tileText: ""}).tileText;
    }

    draw() {
        const {visibility} = this.props;

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

        ctx.fillText(tileText.slice(0, tileText.slice(1).indexOf("(")), 10, 20);
        ctx.fillText(_.rest(tileText.split(/\s+/), 1).join(" "), 10, 256 - 10);
    }

    componentDidMount() {
        super.componentDidMount();
        this.draw();
    }

    componentDidUpdate(prevProps /*: object */) {
        super.componentDidUpdate(prevProps);
        this.draw();
    }

    shouldComponentUpdate(nextProps /*: object */) /*: boolean */ {
        return !shallowEqual(
            _.pick(this.props, Object.keys(propTypes)),
            _.pick(nextProps, Object.keys(propTypes))
        );
    }
}

GridLayer.propTypes = propTypes;
GridLayer.defaultProps = defaultProps;

module.exports = GridLayer;
