import Label from "./Label";
import { em, PIXEL_SCALE } from "./main";

export default class InventoryItem
{
    constructor(tileRect, spriteIndex, amount)
    {
        this.tileRect = tileRect;

        this.spriteIndex = spriteIndex;
        this.amount = amount;

        this.amountLabel = new Label({ tileX: (this.tileRect.x + 1), tileY: (this.tileRect.y + 0.2) }, this.GetAmountString(), 0, assets.charsets.large_font);

        em.AddRender(this);
    }

    GetAmountString()
    {
        return ("x" + this.amount);
    }

    SetAmount(amount)
    {
        this.amount = amount;
        this.amountLabel.text = this.GetAmountString();
    }

    Draw()
    {
        sprite(this.spriteIndex, this.tileRect.x * PIXEL_SCALE, this.tileRect.y * PIXEL_SCALE);
    }

}