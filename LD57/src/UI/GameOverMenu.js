import { consoleLog, EM, getFont, PIXEL_SCALE, SCORES, setFont, SETUP, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main";
import Button from "./Button";

export default class GameOverMenu
{
    constructor()
    {
        this.renderLayer = "MENU_UI";
        this.dims = { w: 24, h: 8 };

        this.pos ={x: (TILE_WIDTH - this.dims.w) * 0.5, y: (TILE_HEIGHT - this.dims.h) * 0.5};

        this.largeNarrFont = getFont("LargeNarr");

        this.backToMenuButton = new Button(
                    { x: this.pos.x, y: this.pos.y + this.dims.h, w: this.dims.w, h: 1.5 }, 
                    { font: "LargeNarr", rect: { text: "BACK TO TITLE", colour: 14, textColour: 13, borderColour: 15 } }, "UI");

        this.backToMenuButton.Click = () => { this.BackToMenu(); }

        this.gameWorld = EM.GetEntity("GAME_WORLD");

        this.savedHighScore = SCORES.GetHighScore();

        this.oldHighScore = this.savedHighScore.score;
        this.newHighScore = this.gameWorld.player.CalculateFinalScore();

        if(this.newHighScore > this.oldHighScore)
        {
            SCORES.SetHighScore({ 
                score: this.newHighScore,
                days: this.gameWorld.daysPassed,
                parcels: this.gameWorld.player.parcelsDelivered
            });
        }

        EM.RegisterEntity(this);
    }

    BackToMenu()
    {
        SETUP();
    }

    Update(deltaTime)
    {
        //consoleLog(EM.keyboardState);
    }

    DrawCentreText(text, y)
    {
        print(text, (this.pos.x + (this.dims.w - UTIL.GetTextWidth(text, this.largeNarrFont)) * 0.5 ) * PIXEL_SCALE, y);
    }

    Draw()
    {
        paper(6);
        rectf(this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

        pen(1);
        setFont(this.largeNarrFont);
        let lineY = this.pos.y * PIXEL_SCALE + 2;
        let lineHeight = 12;        

        this.DrawCentreText("GAME OVER", lineY);

        lineY+=lineHeight + 4;
        this.DrawCentreText(`You kept the post office running for:`, lineY);
        lineY += lineHeight;
        this.DrawCentreText(`${this.gameWorld.daysPassed} days`, lineY);
        lineY += lineHeight + 4;
        this.DrawCentreText(`${this.gameWorld.player.parcelsDelivered} deliveries completed`, lineY);
        lineY += lineHeight + 4;
        this.DrawCentreText(`Score:`, lineY);
        lineY += lineHeight;
        this.DrawCentreText(`${this.newHighScore}`, lineY);

        if(this.newHighScore > this.oldHighScore)
        {
            lineY += lineHeight + 4;
            this.DrawCentreText("NEW HIGH SCORE!", lineY);
        }
    }
}