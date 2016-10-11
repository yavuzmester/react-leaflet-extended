"use strict";

const {PropTypes} = require("react");
const CanvasTileLayer = require("./canvas-tile-layer");
const hexToRgb = require("hex-rgb");
const shallowEqual = require("shallowequal");
const createProxyCanvas = (width, height) => $("<canvas>").attr("width", width).attr("height", height)[0];

const propTypes = {
    name: PropTypes.string.isRequired,
    noWrap: PropTypes.bool,
    data: PropTypes.shape({
        tiles: PropTypes.arrayOf(
            PropTypes.shape({
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
                squares: PropTypes.arrayOf(
                    PropTypes.shape({
                        x: PropTypes.number.isRequired,
                        y: PropTypes.number.isRequired,
                        color: PropTypes.string.isRequired,
                        opacity: PropTypes.number.isRequired
                    })
                ).isRequired
            })
        ).isRequired,
        tileWidthInSquares: PropTypes.number
    }),
    opacity: PropTypes.number
};

const defaultProps = {
    noWrap: true,
    data: {
        tiles: []
    },
    opacity: 1
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
    squaresOfTile(tile /*: object */) /*: array<object> */ {
        const {data} = this.props;
        return (data.tiles.find(t => t.x === tile.x && t.y === tile.y) || {squares: []}).squares;
    }

    draw() {
        if (this.leafletElement._map) {
            this.leafletElement._reset();
            this.leafletElement._update();
            this.tileCanvases().forEach(tc => this._drawTileCanvas(tc));
        }
    }

    _drawTileCanvas(tileCanvas /*: object */) {
        const ctx = tileCanvas.getContext("2d");
        initContext(ctx);
        const imageData = this._prepareTileImageData(tileCanvas);
        drawImageDataToContext(ctx, imageData);
    }

    _prepareTileImageData(tileCanvas /*: object */) /*: ImageData */ {
        const {tileWidthInSquares} = this.props.data;

        const ctx = tileCanvas.getContext("2d"),
            blankImageData = ctx.createImageData(tileWidthInSquares, tileWidthInSquares),
            tile = tileCanvas._tilePoint,
            squaresOfTile = this.squaresOfTile(tile);

        return squaresOfTile.reduce((memo, s) => {
            const idx = (memo.height - 1 - s.y) * memo.width + s.x,
                [r, g, b] = hexToRgb(s.color),
                a = Math.max(0, Math.min(255, s.opacity)) * 255;

            memo.data[idx * 4] = r;
            memo.data[idx * 4 + 1] = g;
            memo.data[idx * 4 + 2] = b;
            memo.data[idx * 4 + 3] = a;

            return memo;
        }, blankImageData);
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
