import Button from "./Button";
import Label from "./Label";
import { consoleLog, em, GetNumberedLevel, PIXEL_SCALE, GetNumberedLevelName, SFX } from "./main";

export default class EndScreen
{
    constructor(displayRect, mainText, additionalText, colours)
    {
        this.displayRect = displayRect;
        this.mainText = mainText;
        this.additionalText = additionalText;
        this.colours = colours;
        consoleLog(this.colours);

        this.additionalLabels = [];

        this.levelOverMax = 4;

        this.isWin = false;
        this.z = 1000;
    }

    Collapse()
    {
        em.RemoveRender(this.mainLabel);
        for(var i = 0; i < this.additionalLabels.length; i ++)
        {
            em.RemoveRender(this.additionalLabels[i]);
        }

        em.RemoveRender(this);
    }

    ShowScreen(winLose, electronsLeft)
    {
        //consoleLog("Electrons Left:" + electronsLeft);
        this.isWin = winLose;
        this.mainLabel = new Label(this.mainText.pos, winLose ? this.mainText.winText : ( electronsLeft === 0 ? this.mainText.loseText : this.mainText.altLose), 4);
        this.mainLabel.z = 1010;

        var addText = (this.isWin || ((this.isWin === false) &&  (electronsLeft === 0))) ? this.levelOverMax : this.additionalText.length; 

        if(this.isWin == false && electronsLeft > 0)
        {
            this.displayRect.tileH += 1;
        } 

        for(var i = 0; i < addText; i ++)
        {
            var newLabel = new Label(this.additionalText[i].pos, this.additionalText[i].text, 4);
            newLabel.z = 1010;
            this.additionalLabels.push(newLabel);
        }
        
        if(this.isWin && em.lvlNumber < em.maxLevel)
        {
            var buttonParams = {
                tileRect: { x: this.displayRect.tileX, y: (this.displayRect.tileY + this.displayRect.tileH + 0.75), w: this.displayRect.tileW, h: 1 },
                text: "Next Level (Space)",
                options: { type: "LVL", value: GetNumberedLevelName(em.lvlNumber + 1), endScreen: true },
                colours: { shadow: 3, top: 7, hover: 15 }
            }

            this.nextLevelButton = new Button(buttonParams.tileRect, buttonParams.text, buttonParams.options, buttonParams.colours);
            this.nextLevelButton.SetIsVisible(true);
        }

        /*
        this.tertiaryLabel = new Label(this.tertiaryText.pos, this.tertiaryText.text, 4);
        this.tertiaryLabel.z = 1010;
    */
   /*
        if(winLose)
        {
            em.QueueSound(SFX.victory);
        }
        else
        {
            em.QueueSound(SFX.defeat);
        }
    */
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