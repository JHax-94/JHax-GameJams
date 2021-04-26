import Label from "./Label";
import { em, PIXEL_SCALE } from "./main";

export default class InventoryItem
{
    constructor(tileRect, spriteIndex, amount, showText)
    {
        this.tileRect = tileRect;

        this.spriteIndex = spriteIndex;
        this.amount = amount;

        if(showText)
        {
            this.amountLabel = new Label({ tileX: (this.tileRect.x + 1), tileY: (this.tileRect.y + 0.2) }, this.GetAmountString(), 0, assets.charsets.large_font);
        }
        else 
        {
            this.amountLabel = null;
        }
        

        em.AddRender(this);
    }

    GetAmountString()
    {
        return ("x" + this.amount);
    }

    Delete()
    {
        if(this.amountLabel)
        {
            this.amountLabel.Delete();
        }
        em.RemoveRender(this);
    }

    SetAmount(amount)
    {
        if(this.amountLabel)
        {
            this.amount = amount;
            this.amountLabel.text = this.GetAmountString();
        }
    }

    Draw()
    {
        sprite(this.spriteIndex, this.tileRect.x * PIXEL_SCALE, this.tileRect.y * PIXEL_SCALE);
    }

}