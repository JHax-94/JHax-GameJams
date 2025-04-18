let pixelBox = require("pixelbox");
let gl = require("pixelbox/webGL");
let context = require("pixelbox/webGL/context");
let SpriteRender = require('pixelbox/webGL/renderers/sprite');
let cgl = context.gl;

export default class TextureExtender
{
    constructor()
    {
    }

    RotationMatrix(angle)
    {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        return [
            [ cos, -sin ],
            [ sin, cos ]
        ];
    }

    MatrixTimesVector(matrix, vector)
    {
        let resultVec = [0, 0];
        for(let i = 0; i < resultVec.length; i ++)
        {
            let val = 0;
            for(let j = 0; j < matrix[i].length; j ++)
            {
                val += vector[j] * matrix[i][j];
            }

            resultVec[i] = val;
        }

        return resultVec;

    }

    RotateVector(x, y, rotateBy)
    {
        let vec = [x, y];
        let rotMat = (!!rotateBy.length) ? rotateBy : this.RotationMatrix(rotateBy);
        let rotVec = this.MatrixTimesVector(rotMat, vec);
        return rotVec;
    }

    LogPixels(bufferArray)
    {
        let prettyPixels = [];

        for(let i = 0; i < bufferArray.length / 4; i ++)
        {
            prettyPixels = { 
                r: bufferArray[i], 
                g: bufferArray[i+1],
                b: bufferArray[i+2],
                a: bufferArray[i+3]
            };
        }

        console.log(prettyPixels);
    }

    ExtendTextureClass(texture)
    {
        let coreInit = texture.prototype._init;

        let extender = this;

        SpriteRender.pushStretchSpriteEnhanced = function (x1, y1, w, h, u1, v1, spriteW, spriteH, angle, fixedTl) {

            let u2 = u1 + spriteW;
            let v2 = v1 + spriteH;
            let x2 = x1 + w;
            let y2 = y1 + h;

            let tl = [0,0];
            let tr = [0,0];
            let bl = [0,0];
            let br = [0,0];

            if(angle !== 0)
            {
                let centre = { x: 0.5 * (x1+x2), y: 0.5 * (y1+y2) };
                
                let x1c = x1 - centre.x;
                let x2c = x2 - centre.x;
                let y1c = y1 - centre.y;
                let y2c = y2 - centre.y;

                let rotMat = extender.RotationMatrix(angle);

                let tlp = extender.RotateVector(x1c, y1c, rotMat);
                let trp = extender.RotateVector(x2c, y1c, rotMat);
                let blp = extender.RotateVector(x1c, y2c, rotMat);
                let brp = extender.RotateVector(x2c, y2c, rotMat);
                            
                if(fixedTl)
                {
                    let offset = [ x1 - tlp[0], y1 - tlp[1] ];
                    tl = [ x1, y1 ];
                    tr = [ trp[0] + offset[0], trp[1] + offset[1]];
                    bl = [ blp[0] + offset[0], blp[1] + offset[1]];
                    br = [ brp[0] + offset[0], brp[1] + offset[1]];

                }
                else
                {
                    tl = [ tlp[0] + centre.x, tlp[1] + centre.y ];
                    tr = [ trp[0] + centre.x, trp[1] + centre.y ];
                    bl = [ blp[0] + centre.x, blp[1] + centre.y ];
                    br = [ brp[0] + centre.x, brp[1] + centre.y ];
                }
            }
            else
            {
                tl = [x1,y1];
                tr = [x2,y1];
                bl = [x1,y2];
                br = [x2,y2];
            }
            
            this.pushQuad(
                tl[0], tl[1], u1, v1,
                tr[0], tr[1], u2, v1,
                br[0], br[1], u2, v2,
                bl[0], bl[1], u1, v2
            );
        };

        texture.prototype._init = function() {
            coreInit.call(this, arguments);
            cgl.texParameteri(cgl.TEXTURE_2D, cgl.TEXTURE_MAG_FILTER, cgl.NEAREST);
        };

        texture.prototype._drawEnhanced = function (x, y, options)
        {
            if(!options) options = {};

            let targetTexture = pixelBox.$screen;

            if(options.target)
            {
                targetTexture = options.target;
            }

            let sx = 0;
            let sy = 0;

            if(options.src)
            {
                sx = options.src.x;
                sy = options.src.y;
            }

            let maintainCentre = options.maintainCentre ?? false;
            let scale = options.scale ?? 1;
            let angle = options.angle ?? 0;

            let fixedTl = options.fixTl ?? false;

            let dw = this.width * scale;
            let dh = this.height * scale;

            let w = this.width;
            let h = this.height;

            if(options.src)
            {
                if(options.src.w)
                {
                    w = options.src.w;
                    dw = options.src.w * scale;
                }

                if(options.src.h)
                {
                    h = options.src.h;
                    dh = options.src.h * scale;
                }
            }

            // -- Modified from PixelBox WebGL Texture code...
            let px = ~~Math.round((x + (maintainCentre ? (w-dw)*0.5 : 0) || 0) - this.camera.x);
            let py = ~~Math.round((y + (maintainCentre ? (h-dh)*0.5 : 0) || 0) - this.camera.y);

            let renderers = gl.batcher.renderers;
            
            gl.batcher.prepare(renderers.sprite, this, targetTexture)
                .pushStretchSpriteEnhanced(px, py, dw, dh, sx, sy, w, h, angle, fixedTl);
        };

        texture.prototype._copy = function(sx, sy, sw, sh, target, tx, ty)
        {
            this._drawEnhanced(tx, ty, { target: target, src: { x: sx, y: sy, w: sw, h: sh }});
        }

        texture.prototype._logPixels = function(x, y, w, h)
        {
            console.log("===== PIXEL PRINT =====");

            console.log(cgl.bindFramebuffer);
            console.log(gl.bindFramebuffer);
            console.log(context.bindFramebuffer);
            console.log(this);

            try {
                var pixels = new Uint8Array(w * h * 4);
                cgl.bindFramebuffer(cgl.FRAMEBUFFER, this.frameBuffer);
                cgl.readPixels(x, y, w, h, cgl.RGBA, cgl.UNSIGNED_BYTE, pixels);
                cgl.bindFramebuffer(cgl.FRAMEBUFFER, null);
                
                extender.LogPixels(pixels)
            }
            catch(e)
            {
                console.error("Failed to read pixels:");
                console.error(e);
            }
            
        };

        return texture;
    }
}