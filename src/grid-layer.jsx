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

        const indexOfFirstLeftParen = 0,
            indexOfSecondLeftParen = tileText.slice(1).indexOf("(") + 1,
            indexOfLastSpace = tileText.lastIndexOf(" ");

        const tileXYStr = tileText.slice(indexOfFirstLeftParen, indexOfSecondLeftParen - 1),
            tileMercatorStr = tileText.slice(indexOfSecondLeftParen, indexOfLastSpace),
            count = tileText.slice(indexOfLastSpace + 1);

        ctx.fillText(tileXYStr, 2, 20);
        ctx.fillText(count, 100, 123);
        ctx.fillText(tileMercatorStr, 2, 246);
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
