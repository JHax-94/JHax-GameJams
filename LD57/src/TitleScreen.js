import SymbolGenerator from "./GameWorld/SymbolGenerator";
import { consoleLog, EM, getFont, PIXEL_SCALE, SCORES, setFont, SETUP, TILE_HEIGHT, TILE_WIDTH, UTIL } from "./main";
import Button from "./UI/Button";

export default class TitleScreen
{
    constructor()
    {   
        this.titleMap = getMap("TitleMap");
        
        consoleLog(this.titleMap);

        this.pos = {
            x: 0,
            y: 0
        };

        let userPrefs = SCORES.GetPrefs();

        this.tutorialOn = userPrefs.tutorialOn;
        this.chillMode = userPrefs.chillMode;
        this.useJamBalance = true;

        this.symbolGenerator = new SymbolGenerator();

        this.lineHeight = 12;

        this.symbolsAt = [
            { x: 1, y: 3 },
            { x: 1, y: 4 },
            { x: 2, y: 4 },
            { x: 12, y: 1 },
            { x: 13, y: 1 },
            { x: 13, y: 2 }
        ];

        this.font = getFont("LargeNarr");

        this.mainTextPos = {
            x: this.titleMap.width * PIXEL_SCALE,
            y: this.titleMap.height * PIXEL_SCALE
        };

        this.mainText = [
            { txt: "MEMO" },
            { txt: "====" },
            { txt: "> You have been assigned the task of running the POST OFFICE "},
            { txt: "  in the DEEP SPACE D5D0-CHERMWARDS SECTOR"},
            {},
            { txt: "> COMMUNICATION is ESSENTIAL in this REMOTE SECTOR of space" },
            {},
            { txt: "> The GALACTIC FEDERATION cannot provide you with PUBLIC FUNDS" },
            {},
            { txt: "> ENSURE you COMPLETE DELIVERIES PROMPTLY to keep the service PROFITABLE" },
            {},
            { txt: "> FAILURE WILL NOT BE TOLERATED" },
            {},
            { txt: "CONTROLS" },
            { txt: "========"},
            { map: "leftMouse", txt: "    Select spacecraft / planet / cargo" },
            { map:"rightMouse", txt: "    Send spacecraft to / transfer cargo" },
            { map: "directionKeys", txt: "    Move view" },
            {},
            { txt: "Click below to begin" }
        ]        

        EM.RegisterEntity(this);
        
        this.modeToggles = {
            position: { x: 0.25, y: TILE_HEIGHT - 6 },
            lineHeight: 1.25,
            textWidth: 5, /* 6.5 = When Game Jam balance comes into play,*/
            modes: [ 
                { text: "Tutorial:", toggleAction: () => { this.tutorialOn = !this.tutorialOn; }, toggleValue: () => {  return this.tutorialOn; } },
                { text: "Chill mode:", toggleAction: () => { this.chillMode = !this.chillMode; }, toggleValue: () => { return this.chillMode; } },
                /*{ text: "Game Jam balance:", toggleAction: () => { this.useJamBalance = !this.useJamBalance; }, toggleValue: () => {return this.useJamBalance; } }*/
            ]
        };

        this.startButtonSkip = new Button(
            { x: this.titleMap.width, y: TILE_HEIGHT - 5, w: 13, h: 1.5}, 
            { font: "LargeNarr", rect: { text: "START GAME", colour: 14, textColour: 13, borderColour: 15 } }, "UI");

        this.startButtonSkip.Click = () => this.StartGame();

        this.resetButton = new Button(
            { x: 0.25, y: TILE_HEIGHT - 1, w: 6, h: 0.75}, 
            { font: "LargeNarr", rect: { text: "RESET SCORES", colour: 14, textColour: 13, borderColour: 15 } }, "UI");

        this.resetButton.Click = () => { SCORES.ClearAll(); this.highScore = SCORES.GetHighScore(); this.RefreshToggles() }

        this.highScore = SCORES.GetHighScore();

        this.BuildSymbols();
        this.BuildModeToggles();        
    }

    RefreshToggles()
    {
        for(let i = 0; i < this.modeToggles.modes.length; i++)
        {
            let modeToggle = this.modeToggles.modes[i];

            let val = modeToggle.toggleValue();

            modeToggle.SetText(val ? "ON" : "OFF");   
        }
    }

    BuildModeToggles()
    {
        for(let i = 0; i < this.modeToggles.modes.length; i ++)
        {
            let startText = this.modeToggles.modes[i].toggleValue() ? "ON" : "OFF";

            let modeToggleButton = new Button(
                { x: this.modeToggles.position.x + this.modeToggles.textWidth, y: this.modeToggles.position.y + i * this.modeToggles.lineHeight - 0.125, w: 3.5, h: 0.75 },
                { font: "LargeNarr", rect: { text: startText, colour: 14, textColour: 13, borderColour: 15 } }, "UI");

            modeToggleButton.Click = () => {
                this.modeToggles.modes[i].toggleAction();
                
                let newValue = this.modeToggles.modes[i].toggleValue();

                this.UpdatePrefs();

                modeToggleButton.SetText(newValue ? "ON" : "OFF");
            }

            this.modeToggles.modes[i].button = modeToggleButton;
        }
    }

    GetPrefsObject()
    {
        return {
            tutorialOn: this.tutorialOn,
            chillMode: this.chillMode
        };
    }

    UpdatePrefs()
    {
        SCORES.SetPrefs(this.GetPrefsObject());
    }

    StartGame()
    {
        let startGameOptions = this.GetPrefsObject();

        SETUP("Game", startGameOptions);
    }

    BuildSymbols()
    {
        for(let i = 0; i < this.symbolsAt.length; i ++)
        {
            this.symbolsAt[i].symbol = this.symbolGenerator.GenerateSymbol();
        }
    }

    Draw()
    {
        this.titleMap.draw(this.pos.x, this.pos.y);

        for(let i = 0; i < this.symbolsAt.length; i ++)
        {
            let sym = this.symbolsAt[i];
            sym.symbol._drawEnhanced(this.pos.x + sym.x * PIXEL_SCALE, this.pos.y + sym.y * PIXEL_SCALE);
        }

        

        let yPos = PIXEL_SCALE + 1;//this.mainTextPos.y;

        pen(1);
        setFont(this.font);

        if(this.highScore > 0)
        {
            print(`HIGH SCORE: `, 2, this.titleMap.height * PIXEL_SCALE + 2);
            print(`   ${this.highScore}`, 2, this.titleMap.height * PIXEL_SCALE + 16);
        }

        for(let i = 0; i < this.mainText.length; i ++)
        {
            let drawX = this.mainTextPos.x + 8;
            let startY = yPos;

            let line = this.mainText[i];
            let lineHeight = 0;

            if(line.map)
            {
                let map = getMap(line.map);

                map.draw(drawX, yPos);
                drawX += map.width * PIXEL_SCALE + 4;

                lineHeight = map.height * PIXEL_SCALE;
            }

            if(line.txt)
            {
                if(lineHeight > 0)
                {
                    yPos = yPos + (lineHeight - UTIL.GetTextHeight("", this.font) * PIXEL_SCALE) * 0.5;
                }

                //consoleLog(`Print ${line.txt} at ${this.mainTextPos.x}, ${yPos}`);
                print(line.txt, drawX, yPos);
                if(lineHeight === 0)
                {
                    lineHeight =  UTIL.GetTextHeight("", this.font) * PIXEL_SCALE;
                }
            }

            if(lineHeight < this.lineHeight)
            {
                lineHeight = this.lineHeight;
            }
            else
            {
                lineHeight += 4;
            }

            yPos = startY + lineHeight;
        }

        for(let i = 0; i < this.modeToggles.modes.length; i ++)
        {
            let toggle = this.modeToggles.modes[i];

            print(toggle.text, this.modeToggles.position.x * PIXEL_SCALE, this.modeToggles.position.y * PIXEL_SCALE + i * this.modeToggles.lineHeight * PIXEL_SCALE);
        }

        setFont("Default");

        let creditsHeight = 8;
        let credits = { x: (TILE_WIDTH - 5) * PIXEL_SCALE - 2, y: (TILE_HEIGHT) * PIXEL_SCALE - 2 - 6*creditsHeight };        
        
        print("Credits:", credits.x, credits.y);
        print("Game + Music by jhax", credits.x, credits.y + creditsHeight);
        print("Made in:", credits.x, credits.y + 2 * creditsHeight);
        print("PixelBox by cstoquer", credits.x, credits.y + 3 * creditsHeight);
        print("with:", credits.x, credits.y + 4 * creditsHeight);
        print("p2.js by schteppe", credits.x, credits.y + 5 * creditsHeight);
    }
}