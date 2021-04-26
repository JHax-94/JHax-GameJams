import { BACKGROUND, consoleLog, em, PIXEL_SCALE, Texture } from "./main";

export default class SeaBackground
{
    constructor()
    {
        this.parallax = 1;
        var backgroundConf = BACKGROUND.blocks;

        this.rows = [];

        for(var i = 0; i < backgroundConf.length; i ++)
        {
            if(backgroundConf[i].type === "BLOCK")
            {
                for(var j = 0; j < backgroundConf[i].size; j ++)
                {
                    this.rows.push({
                        type: "BLOCK",
                        colour: backgroundConf[i].colour
                    });
                }
            }
            else if(backgroundConf[i].type === "TEXTURE")
            {
                this.rows.push({
                    type: "TEXTURE",
                    texture: this.BuildTextureForSprite(backgroundConf[i].sprite) 
                });
            }

        }
    }

    BuildTextureForSprite(spriteIndex)
    {
        var tex = new Texture(32*PIXEL_SCALE, PIXEL_SCALE);

        tex.setTilesheet(assets.tilesheet_dive);
        for(var x = 0; x < 32; x ++)
        {
            tex.sprite(spriteIndex, x*PIXEL_SCALE, 0);
        }

        return tex;
    }



    Draw()
    {
        for(var i = 0; i < this.rows.length; i ++)
        {
            if(this.rows[i].type === "BLOCK")
            {
                paper(this.rows[i].colour);
                rectf(0, i*PIXEL_SCALE + em.cameraDepth*this.parallax, 32*PIXEL_SCALE, PIXEL_SCALE);
            }
            else if(this.rows[i].type === "SPRITE")
            {
                for(var x = 0; x < 32; x ++)
                {
                    sprite(this.rows[i].sprite, x*PIXEL_SCALE, i*PIXEL_SCALE + em.cameraDepth * this.parallax);
                }
            }
            else if(this.rows[i].type === "TEXTURE")
            {
                draw(this.rows[i].texture, 0, i*PIXEL_SCALE + em.cameraDepth*this.parallax);
            }
        }
    }
}