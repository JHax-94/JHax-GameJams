import Texture from "pixelbox/Texture";
import Button from "../Menus/Button";
import Label from "../Menus/Label";
import { POS_TYPE } from "../Menus/PositionType";
import Rect from "../Menus/Rect";
import Sprite from "../Menus/Sprite";
import { EM, PIXEL_SCALE, consoleLog, getObjectConfig } from "../main";

export default class VillageShop
{
    constructor(village, shopConfig)
    {
        this.renderLayer = "OVERLAY_UI";

        this.globalConfig = getObjectConfig("VillageShop", true);
        this.shopConfig = shopConfig;

        this.village = village;

        this.inventory = shopConfig.inventory;

        this.components = [];
        this.textures = [];

        this.BuildUi();

        EM.RegisterEntity(this);
    }

    Hide(setHide)
    {
        this.hide = setHide;

        for(let i = 0; i < this.components.length; i ++)
        {
            this.components[i].hide = this.hide;
        }
    }

    TryBuy(item)
    {
        consoleLog("Try to buy item...");

        consoleLog(item);

        let shopper = this.village.GetShoppingPlayer();

        consoleLog("Check shopper gold:");
        if(shopper.HasItem("Gold", item.price))
        {
            consoleLog("Process transaction!");
            shopper.AddItem({
                object: "Gold",
                quantity: -item.price
            });

            shopper.AddItem({
                object: item.object,
                quantity: 1
            }, true);
        }

    }

    BuildUi()
    {
        let base = this.village.GetScreenPos();

        let basePos = { x: base.x / PIXEL_SCALE, y: base.y / PIXEL_SCALE };

        let backingRect = null;

        console.log("Build Village Shop UI");
        for(let i = 0; i < this.inventory.length; i ++)
        {
            let item = this.inventory[i];

            let itemConf = getObjectConfig(item.object);

            let rowY = basePos.y + i;

            let itemLabelWidth = 8

            //let priceLabelWidth = 3

            let itemSpritePos = { x: basePos.x, y: rowY, w: 1, h: 1};
            let itemLabelPos = { x: basePos.x + itemSpritePos.w + 0.25, y: rowY + 0.125, w: itemLabelWidth, h: 1 };
            let priceLabelPos = { x: basePos.x + itemSpritePos.w + itemLabelPos.w + 0.5, y: rowY + 0.125, w: 3, h: 1 };
            let buttonPos = { x: basePos.x + itemSpritePos.w + itemLabelPos.w + priceLabelPos.w, y: rowY, w: 3, h: 1 };

            if(backingRect === null)
            {
                let totalWidth = itemSpritePos.w + itemLabelPos.w + priceLabelPos.w + buttonPos.w;
                let totalHeight = this.inventory.length; 

                let rect = { x: basePos.x - 0.5, y: basePos.y - 0.5, w: totalWidth + 1, h: totalHeight + 1 };

                backingRect = new Rect(rect.x * PIXEL_SCALE, rect.y * PIXEL_SCALE, rect.w * PIXEL_SCALE, rect.h * PIXEL_SCALE, 0, "WORLD_UI");
            }

            let itemSprite = new Sprite(itemSpritePos.x * PIXEL_SCALE, itemSpritePos.y * PIXEL_SCALE, itemConf.spriteIndex, "WORLD_UI");
            /*
            let itemLabel = new Label(
                itemLabelPos,
                itemConf.displayName,
                {
                    posType: POS_TYPE.CENTRE,
                    renderLayer: "WORLD_UI"
                });
            */
            let labelTex = new Texture(PIXEL_SCALE * 8, PIXEL_SCALE);
            labelTex.print(itemConf.displayName, 0, 0);

            this.textures.push({ 
                pos: { x: itemLabelPos.x, y: itemLabelPos.y }, 
                tex: labelTex });

            let priceTex = new Texture(PIXEL_SCALE * 4, PIXEL_SCALE);

            priceTex.print(`${item.price}g`);

            this.textures.push({
                pos: { x: priceLabelPos.x, y: priceLabelPos.y },
                tex: priceTex
            });
                /*
            let priceLabel = new Label(priceLabelPos,
            `${item.price}g`,
            {
                posType: POS_TYPE.CENTRE,
                renderLayer: "WORLD_UI"
            });*/
            
            let buyButton = new Button(buttonPos, {
                style: "StandardButton",
                text: `Buy`,
            }, "WORLD_UI");

            let shop = this;

            buyButton.ClickEvent = (btn) => {
                shop.TryBuy(item);
            }

            this.components.push(backingRect);
            this.components.push(itemSprite);
            //this.components.push(itemLabel);
            //this.components.push(priceLabel);
            this.components.push(buyButton);
        }
    }

    Draw()
    {
        for(let i = 0; i < this.textures.length; i ++)
        {
            let t = this.textures[i];

            t.tex._drawEnhanced(t.pos.x * PIXEL_SCALE, t.pos.y * PIXEL_SCALE, { scale: 2 });
        }
    }
}