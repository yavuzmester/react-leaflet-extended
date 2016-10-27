"use strict";

const {PropTypes} = require("react");
const CanvasTileLayer = require("./canvas-tile-layer");
const hexToRgb = require("hex-rgb");
const _ = require("underscore");
const shallowEqual = require("shallowequal");
const createProxyCanvas = (width, height) => $("<canvas>").attr("width", width).attr("height", height)[0];

const propTypes = {
    name: PropTypes.string.isRequired,
    noWrap: PropTypes.bool,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            tileX: PropTypes.number.isRequired,
            tileY: PropTypes.number.isRequired,
            squaresInTile: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.number.isRequired,
                    y: PropTypes.number.isRequired,
                    color: PropTypes.string,
                    opacity: PropTypes.number
                })
            ).isRequired
        })
    ),
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
    }
    else {
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

    squaresInTile(tile /*: object */) /*: array<object> */ {
        const {data} = this.props;
        return (data.find(t => t.tileX === tile.x && t.tileY === tile.y) || {squaresInTile: []}).squaresInTile;
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
        const ctx = tileCanvas.getContext("2d");
        initContext(ctx);
        const imageData = this._prepareTileImageData(tileCanvas);
        drawImageDataToContext(ctx, imageData);
    }

    _prepareTileImageData(tileCanvas /*: object */) /*: ImageData */ {
        const {tileWidthInSquares} = this.props;

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

HeatLayer.propTypes = propTypes;
HeatLayer.defaultProps = defaultProps;

module.exports = HeatLayer;
