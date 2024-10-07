import Texture from "pixelbox/Texture";
import { EM, PIXEL_SCALE } from "../main";

export default class Background
{
    constructor()
    {
        this.renderLayer = "BACKGROUND";

        this.w = 3;
        this.h = 3;

        this.backgroundTex = this.BuildTexture();

        EM.RegisterEntity(this);
    }

    BuildTexture()
    {
        let texture = new Texture(this.w * PIXEL_SCALE, this.h * PIXEL_SCALE);

        texture.paper(9);
        texture.rectf(0, 0, this.w *PIXEL_SCALE, this.h * PIXEL_SCALE);

        return texture;
    }

    GetScreenPos(tilePos) 
    {
        let physPos = EM.TileToPhysPosition(tilePos);

        EM.hudLog.push(`BPhys: (${physPos[0]}, ${physPos[1]})`);

        return { 
            x: Math.round(physPos[0] - 0.5 * this.w * PIXEL_SCALE - EM.camera.x), 
            y: Math.round(-(physPos[1] +0.5* this.h * PIXEL_SCALE - EM.camera.y)) 
        };
    };

    Draw()
    {
        let tilePos = {x: 0, y: 0, w: this.w, h: this.h };
        let screenPos = this.GetScreenPos(tilePos);



        EM.hudLog.push(`B (${screenPos.x}, ${screenPos.y})`);

        for(let x = -1; x <= 1; x ++)
        {
            for(let y = -1; y<=1; y++)
            {   
                let drawAt = { x: screenPos.x - x * this.w * PIXEL_SCALE, y: screenPos.y - y * this.h * PIXEL_SCALE }

                EM.hudLog.push(`BD: (${drawAt.x}, ${drawAt.y})`);

                this.backgroundTex._drawEnhanced(drawAt.x,  drawAt.y);
            }
        }

        
    }
}