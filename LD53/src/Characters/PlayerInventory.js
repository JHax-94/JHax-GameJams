import Label from "../Menus/Label";
import { POS_TYPE } from "../Menus/PositionType";
import Rect from "../Menus/Rect";
import Sprite from "../Menus/Sprite";
import { EM, PIXEL_SCALE, consoleLog, getObjectConfig } from "../main";

export default class PlayerInventory
{
    constructor(player)
    {
        this.player = player;

        EM.RegisterEntity(this);

        this.inventoryItems = [];

        this.BuildUi();
    }

    UpdateUi()
    {
        consoleLog("Updating UI...")

        for(let i = 0; i < this.player.inventory.length; i ++)
        {
            consoleLog("-------------------")
            consoleLog("Check UI for item:");

            let item = this.player.inventory[i];
            consoleLog(item);

            consoleLog("In UI List...");
            let existing = this.inventoryItems.find(it => it.item.object === item.object);            

            if(existing)
            {
                consoleLog("Update Existing UI:");
                consoleLog(existing);
                if(item.quantity || item.quantity === 0)
                {
                    existing.qtyLabel.SetText(`${item.quantity}`);
                }
            }
            else
            {
                this.BuildInventoryItem(this.player.inventory[i], i);
            }
            
        }
    }

    BuildInventoryItem(item, i)
    {
        let objectConf = getObjectConfig(item.object);
        let qty = item.quantity;

        
        let baseX = PIXEL_SCALE * 2 * i + PIXEL_SCALE;    
        let baseY = PIXEL_SCALE;

        let boxW = PIXEL_SCALE + 8;

        let padding = (boxW- PIXEL_SCALE)*0.5;

        let promptW = 0.5*PIXEL_SCALE;

        new Rect(baseX - padding, baseY  + 1 - padding, boxW, boxW, 12, "OVERLAY_UI", true);
        new Rect(baseX - padding, baseY - padding, boxW, boxW, 8, "OVERLAY_UI", true);
        new Sprite(baseX, baseY, objectConf.spriteIndex);

        if(objectConf.btn)
        {
            let promptX = baseX + 0.5 * (PIXEL_SCALE - promptW);
            let promptY = baseY + PIXEL_SCALE + 1;

            new Rect(promptX, promptY+1, promptW, promptW, 6, "OVERLAY_UI");
            new Rect(promptX, promptY, promptW, promptW, 4, "OVERLAY_UI");
            new Label({ x: (promptX +0.5*promptW) / PIXEL_SCALE, y: (promptY + 0.5 * promptW) / PIXEL_SCALE, w: 1, h: 1 }, `${objectConf.btn}`, 
            {
                renderLayer: "OVERLAY_UI",
                posType: POS_TYPE.CENTRE
            });
        }

        let label = new Label({ x: baseX / PIXEL_SCALE + 0.5, y: baseY / PIXEL_SCALE - 0.5, w: 5, h: 1 }, objectConf.displayName, {
            renderLayer: "OVERLAY_UI",
            posType: POS_TYPE.CENTRE
        });

        let itemDisplay = {
            item: item,
            itemLabel: label,
        };

        let qtyLabel = new Label({x: baseX / PIXEL_SCALE, y: baseY / PIXEL_SCALE, w:3, h: 1}, "-", {
            renderLayer: "OVERLAY_UI",
            posType: POS_TYPE.TOP_LEFT,
            centred:true,
            background: { margins: { x: 1, y: 1 }}
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
}