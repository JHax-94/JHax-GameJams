import Texture from "pixelbox/Texture";
import { PIXEL_SCALE } from "../main";

export default class SymbolGenerator
{
    constructor()
    {
        this.baseStationSymbol = [
            { s: 1, h: false, v: false, r: false },
            { s: 1, h: true, v: false, r: false },
            { s: 1, h: false, v: false, r: true },
            { s: 1, h: false, v: true, r: true },
            { s: 7, h: false, v: false, r: false }
        ];

        this.edgeMods = [
            { h: false, v: false, r: false },
            { h: false, v: false, r: true },
            { h: true, v: false, r: false },
            { h: false, v:true, r: true }
        ];

        this.edgeSprites = [
            1, 2, 17, 18
        ];
        
        this.centreSprites = [
            { s: 3 },
            { s: 4 },
            { s: 5 },
            { s: 6 },
            { s: 7 }
        ];
    }

    MainStationSymbol()
    {
        let tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        for(let i = 0; i < this.baseStationSymbol.length; i ++)
        {
            let sym = this.baseStationSymbol[i];

            tex.sprite(sym.s, 0, 0, sym.h, sym.v, sym.r);
        }

        return tex;
    }

    GenerateSymbol()
    {
        let tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        let edges = random(3) + 2;
        let centre = random(2);

        for(let i = 0; i < edges; i ++)
        {
            let randomEdge = random(this.edgeSprites.length);

            let mods = this.edgeMods[i];

            tex.sprite(this.edgeSprites[randomEdge], 0, 0, mods.h, mods.v, mods.r);
        }

        if(centre)
        {
            let randomCentre = random(this.centreSprites.length);

            let centre = this.centreSprites[randomCentre];

            tex.sprite(centre.s, 0, 0, centre.h, centre.v, centre.r);
        }

        return tex;
    }
}