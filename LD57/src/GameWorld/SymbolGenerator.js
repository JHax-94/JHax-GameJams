import Texture from "pixelbox/Texture";
import { consoleLog, PIXEL_SCALE } from "../main";

let EDGE_ID = {
    LEFT: 0,
    TOP: 1,
    RIGHT: 2,
    BOTTOM: 3
};

export default class SymbolGenerator
{
    

    constructor()
    {
        this.usedCodes = [];

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

        this.maxCode = Math.pow(2, 15);
        this.minCode = 288; 
        
        this.centreSprites = [
            { code: "000", s: null },
            { code: "001", s: 4 },
            { code: "010", s: 5 },
            { code: "011", s: 6 },
            { code: "100", s: 7 },
            { code: "101", s: 6, h: true },
            { code: "110", s: 8 },
            { code: "111", s: 8, r: true }
        ];

        this.edgeMap = [
            { code: "000", s: null },
            { code: "001", s: 1 },
            { code: "010", s: 2 },
            { code: "011", s: 17 },
            { code: "100", s: 18 },
            { code: "101", s: 19 },
            { code: "110", s: 20 },
            { code: "110", s: 21 }
        ];

    }

    MainStationSymbol()
    {
        /*
        let tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        for(let i = 0; i < this.baseStationSymbol.length; i ++)
        {
            let sym = this.baseStationSymbol[i];

            tex.sprite(sym.s, 0, 0, sym.h, sym.v, sym.r);
        }*/

        return this.GenerateSymbol(4684);
    }

    GetUnusedRandomCode()
    {
        let originalCode = this.minCode + random(this.maxCode - this.minCode);

        let code = originalCode;

        while(this.usedCodes.indexOf(code) >= 0)
        {
            code = code + 1;

            if(code === this.maxCode)
            {
                code = this.minCode;
            }

            if(code === originalCode)
            {
                code = null;
            }
        }
        
        return code;
    }

    GenerateSymbol(code = null)
    {   
        if(code === null)
        {
            code = this.GetUnusedRandomCode();
        }
        
        let tex = null;

        if(code === null)
        {
            console.warn("ALL CODES USED!");
        }
        else
        {
            let octalCodeString = code.toString(8);
            consoleLog(`Octal: ${octalCodeString}`);

            let centreSprite = 0;
            let leftSprite = 0;
            let topSprite = 0;
            let rightSprite = 0;
            let bottomSprite = 0;

            for(let i = 0; i < octalCodeString.length; i ++)
            {
                let digit = octalCodeString.length - 1 - i;

                if(i === 0)
                {
                    centreSprite = octalCodeString[digit];
                }
                else if(i === 1)
                {
                    topSprite = octalCodeString[digit];
                }
                else if(i === 2)
                {
                    leftSprite = octalCodeString[digit];
                }
                else if(i === 3)
                {
                    rightSprite = octalCodeString[digit];
                }
                else if(i === 4)
                {
                    bottomSprite = octalCodeString[digit];
                }
            }

            tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

            this.AddCentreSpriteToTexture(this.centreSprites[centreSprite], tex);

            this.AddEdgeSpriteToTexture(this.edgeMap[leftSprite], EDGE_ID.LEFT, tex);
            this.AddEdgeSpriteToTexture(this.edgeMap[topSprite], EDGE_ID.TOP, tex);
            this.AddEdgeSpriteToTexture(this.edgeMap[rightSprite], EDGE_ID.RIGHT, tex);
            this.AddEdgeSpriteToTexture(this.edgeMap[bottomSprite], EDGE_ID.BOTTOM, tex);
            
            this.usedCodes.push(code);
        }

        return tex;
    }

    AddCentreSpriteToTexture(centre, texture)
    {
        if(centre.s !== null)
        {
            consoleLog(`CENTRE SPRITE: ${centre.s}`);
            texture.sprite(centre.s, 0, 0, centre.h, centre.v, centre.r);
        }
    }

    AddEdgeSpriteToTexture(edge, edgeId, texture)
    {
        if(edge.s !== null)
        {
            let mods = this.edgeMods[edgeId];

            consoleLog(`EDGE_${edgeId} SPRITE: ${edge.s}`);

            texture.sprite(edge.s, 0, 0, mods.h, mods.v, mods.r);
        }
    }


    GenerateSymbol_old()
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