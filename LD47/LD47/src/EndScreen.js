import { Label } from "./Label";
import { em, PIXEL_SCALE, SFX } from "./main";

export default class EndScreen
{
    constructor(displayRect, mainText, secondaryText, tertiaryText, colours)
    {
        this.displayRect = displayRect;
        this.mainText = mainText;
        this.secondaryText = secondaryText;
        this.tertiaryText = tertiaryText;
        this.colours = colours;

        this.isWin = false;
        this.z = 1000;
    }

    ShowScreen(winLose)
    {
        this.isWin = winLose;
        this.mainLabel = new Label(this.mainText.pos, winLose ? this.mainText.winText : this.mainText.loseText, 4);
        this.mainLabel.z = 1010;

        this.secondaryLabel = new Label(this.secondaryText.pos, this.secondaryText.text, 4);
        this.secondaryLabel.z = 1010;
        
        this.tertiaryLabel = new Label(this.tertiaryText.pos, this.tertiaryText.text, 4);
        this.tertiaryLabel.z = 1010;

        if(winLose)
        {
            sfx(SFX.victory);
        }
        else
        {
            sfx(SFX.defeat);
        }

        em.AddRender(this);
    }

    Draw()
    {
        var palette = this.isWin ? this.colours.win : this.colours.lose;
        
        paper(palette.background);
        rectf((this.displayRect.tileX - 0.25)* PIXEL_SCALE, (this.displayRect.tileY + 0.5) * PIXEL_SCALE, this.displayRect.tileW * PIXEL_SCALE, this.displayRect.tileH * PIXEL_SCALE);
        paper(palette.foreground);
        rectf(this.displayRect.tileX * PIXEL_SCALE, this.displayRect.tileY * PIXEL_SCALE, this.displayRect.tileW * PIXEL_SCALE, this.displayRect.tileH * PIXEL_SCALE);
    }
}