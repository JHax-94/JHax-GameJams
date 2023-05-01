import Texture from "pixelbox/Texture";
import Label from "../Menus/Label";
import { POS_TYPE } from "../Menus/PositionType";
import Rect from "../Menus/Rect";
import Sprite from "../Menus/Sprite";
import { EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, consoleLog, getObjectConfig } from "../main";

export default class PlayerInventory
{
    constructor(player)
    {
        this.player = player;

        EM.RegisterEntity(this);

        this.inventoryItems = [];

        this.scaleTex = new Texture(TILE_WIDTH * PIXEL_SCALE, TILE_HEIGHT * PIXEL_SCALE);

        this.drawTex = null;//this.scaleTex;

        this.BuildUi();

        //this.drawAt = DRAW_AT.TOP;
    }

    UpdateUi()
    {   
        this.scaleTex = new Texture(TILE_WIDTH * PIXEL_SCALE, TILE_HEIGHT * PIXEL_SCALE);

        this.inventoryItems = [];

        for(let i = 0; i < this.player.inventory.length; i ++)
        {
            let item = this.player.inventory[i];
            let existing = this.inventoryItems.find(it => it.item.object === item.object);            

            this.BuildInventoryItem(this.player.inventory[i], i, this.scaleTex);

            /*
            if(existing)
            {
                if(item.quantity || item.quantity === 0)
                {
                    existing.qtyLabel.SetText(`${item.quantity}`);
                }
            }
            else
            {
                
            }*/
        }
    }

    BuildInventoryItem(item, i, tex)
    {
        let objectConf = getObjectConfig(item.object);
        let qty = item.quantity;

        
        let baseX = PIXEL_SCALE * 2.5 * i + PIXEL_SCALE;    
        let baseY = PIXEL_SCALE;

        let boxW = PIXEL_SCALE + 8;

        let padding = (boxW- PIXEL_SCALE)*0.5;

        let promptW = 0.5*PIXEL_SCALE;

        new Rect(baseX - padding, baseY  + 1 - padding, boxW, boxW, 12, "OVERLAY_UI", true, tex);
        new Rect(baseX - padding, baseY - padding, boxW, boxW, 8, "OVERLAY_UI", true, tex);
        new Sprite(baseX, baseY, objectConf.spriteIndex, "OVERLAY_UI", tex);

        if(objectConf.btn)
        {
            let promptX = baseX + 0.5 * (PIXEL_SCALE - promptW);
            let promptY = baseY + PIXEL_SCALE + 1;

            new Rect(promptX, promptY+1, promptW, promptW, 6, "OVERLAY_UI", false, tex);
            new Rect(promptX, promptY, promptW, promptW, 4, "OVERLAY_UI", false, tex);
            new Label({ x: (promptX +0.5*promptW) / PIXEL_SCALE, y: (promptY + 0.5 * promptW) / PIXEL_SCALE, w: 1, h: 1 }, `${objectConf.btn}`, 
            {
                renderLayer: "OVERLAY_UI",
                posType: POS_TYPE.CENTRE,
                targetTexture: tex
            });
        }

        let label = new Label({ x: baseX / PIXEL_SCALE + 0.5, y: baseY / PIXEL_SCALE - 0.5, w: 5, h: 1 }, objectConf.displayName, {
            renderLayer: "OVERLAY_UI",
            posType: POS_TYPE.CENTRE,
            targetTexture: tex
        });

        let itemDisplay = {
            item: item,
            itemLabel: label,
        };

        let qtyLabel = new Label({x: baseX / PIXEL_SCALE, y: baseY / PIXEL_SCALE, w:3, h: 1}, "-", {
            renderLayer: "OVERLAY_UI",
            posType: POS_TYPE.TOP_LEFT,
            centred:true,
            background: { margins: { x: 1, y: 1 }},
            targetTexture: tex
        });

        if(qty)
        {
            
            qtyLabel.SetText(`${qty}`);
            
        }
        else
        {
            qtyLabel.SetText(`-`);
        }

        itemDisplay.qtyLabel = qtyLabel;

        this.inventoryItems.push(itemDisplay);
    }

    BuildUi()
    {
        this.UpdateUi();
    }

    Draw()
    {
        let screenPos = this.player.GetScreenPos();
        
        let drawAt = { x: 0, y: 0 };
        if(screenPos.y < (TILE_HEIGHT / 2) * PIXEL_SCALE)
        {
            drawAt.y = (TILE_HEIGHT - 6) * PIXEL_SCALE;
        }

        this.scaleTex._drawEnhanced(drawAt.x, drawAt.y, {scale: 2});
    }
}