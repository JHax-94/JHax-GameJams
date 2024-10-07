import Texture from "pixelbox/Texture";
import { EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "../main";

export default class Background
{
    constructor()
    {
        this.renderLayer = "BACKGROUND";

        this.w = 2 * TILE_WIDTH;
        this.h = 2 * TILE_HEIGHT;

        this.player = null;

        let totalP = 0.05;
        let indyP = totalP / 6;

        this.probs = [
            { index: 71, p: indyP },
            { index: 70, p: indyP },
            { index: 54, p: indyP },
            { index: 55, p: indyP },
            { index: 38, p: indyP },
            { index: 39, p: indyP },
        ];

        this.backgroundTex = this.BuildTexture();

        EM.RegisterEntity(this);
    }

    Player()
    {
        if(this.player === null)
        {
            this.player = EM.GetEntity("GAMEWORLD").player;
        }
        return this.player;
    }

    BuildTexture()
    {
        let texture = new Texture(this.w * PIXEL_SCALE, this.h * PIXEL_SCALE);

        for(let x = 0; x < this.w; x++)
        {
            for(let y = 0; y < this.h; y++)
            {
                let roll = Math.random();

                let index = null;

                let totalP = 0;
                for(let i = 0; i < this.probs.length; i++)
                {
                    if(roll < totalP + this.probs[i].p)
                    {
                        index = this.probs[i].index;
                        break;
                    }
                    else
                    {
                        totalP += this.probs[i].p;
                    }
                }

                if(index)
                {
                    texture.sprite(index, x * PIXEL_SCALE, y * PIXEL_SCALE, random(2) == 0, random(2) === 0, random(2) === 0);
                }
            }
        }

        /*texture.paper(9);
        texture.rectf(0, 0, this.w *PIXEL_SCALE, this.h * PIXEL_SCALE);*/

        return texture;
    }

    GetScreenPos(tilePos) 
    {
        let physPos = EM.TileToPhysPosition(tilePos);

        return { 
            x: Math.round(physPos[0] - 0.5 * this.w * PIXEL_SCALE - EM.camera.x), 
            y: Math.round(-(physPos[1] +0.5* this.h * PIXEL_SCALE - EM.camera.y)) 
        };
    };

    Draw()
    {
        let player = this.Player();

        let playerPos = player.GetTilePos();

        let pW = this.w;//* PIXEL_SCALE;
        let pH = this.h;//* PIXEL_SCALE


        let playerX = Math.floor(playerPos.x / pW) * pW;
        let playerY = Math.floor(playerPos.y / pH) * pH;

        //EM.hudLog.push( `x: ${playerPos.x} [${playerX}], y: ${playerPos.y} [${playerY}]`);

        let tilePos = {x: playerX, y: playerY, w: this.w, h: this.h };
        let screenPos = this.GetScreenPos(tilePos);

        //EM.hudLog.push(`B (${screenPos.x}, ${screenPos.y})`);

        for(let x = -1; x <= 1; x ++)
        {
            for(let y = -1; y<=1; y++)
            {   
                let drawAt = { x: screenPos.x - x * this.w * PIXEL_SCALE, y: screenPos.y - y * this.h * PIXEL_SCALE }

                //EM.hudLog.push(`BD: (${drawAt.x}, ${drawAt.y})`);

                this.backgroundTex._drawEnhanced(drawAt.x,  drawAt.y);
            }
        }

        
    }
}