import { consoleLog, EM, PIXEL_SCALE, TURN_PHASES } from "../main";

export default class ActionBar
{
    constructor(position, config, player)
    {
        this.rootPos = position;
        this.length = config.length;
        this.unfilled = config.unfilled;
        this.filled = config.filled;
        this.highlight = config.highlight;
        this.offm = config.offsetMultiplier;

        this.healthbarStartPos = config.healthbarStartPos;
        this.healthPipColours = [ 9, 10, 7 ];
        
        this.healthBarPip = {
            spacing: 1.5,
            width: 1,
            height: 0.5
        };

        this.healthbarPip = config.healthbarPip

        this.currentActionPos = config.currentActionPos;

        this.currentIndicator = config.currentIndicator;

        this.pipeColour = 6;
        this.activePipeColour = 1;

        this.trackPlayer = player;

        this.rowHeight = config.rowHeight;

        this.actionsList = [];

        this.trackPlayer.actionUi = this;

        for(let i = 0; i < this.length; i++)
        {
            this.actionsList.push({ filled: false });
        }

        EM.RegisterEntity(this);

        this.flowManager = EM.GetEntity("FLOW");

        this.showMoveDetails = false;

        this.animTimer = 0;
        this.animTime = config.animTime;

        this.indicatorAnims = config.indicatorAnims;
        this.animIndex = 0;
    }

    Show()
    {
        this.showMoveDetails = true;
    }

    Hide()
    {
        this.showMoveDetails = false;
    }

    IsPlayerActivePlayer()
    {
        let isActive = false;

        if(this.flowManager.turnPhase === TURN_PHASES.PLAYER_1_INPUT)
        {
            isActive = this.trackPlayer.playerNumber === 1;
        }
        else if(this.flowManager.turnPhase === TURN_PHASES.PLAYER_2_INPUT)
        {
            isActive = this.trackPlayer.playerNumber === 2;
        }

        return isActive;
    }

    Update(deltaTime)
    {
        if(this.IsPlayerActivePlayer())
        {
            this.animTimer += deltaTime;

            if(this.animTimer >= this.animTime)
            {
                this.animTimer = 0;
                this.animIndex = (this.animIndex + 1) % this.indicatorAnims.length;
            }
        }
    }

    Draw()
    {
        paper(this.pipeColour);
        let mainPipe = { 
            x: (this.rootPos.x + 1.325 * this.offm) * PIXEL_SCALE,
            y: 2* PIXEL_SCALE, 
            w: 1,
            h: (this.length) * (this.rowHeight * PIXEL_SCALE) + 3
        };

        if(this.offm < 0)
        {
            mainPipe.x += PIXEL_SCALE;
        }
        rectf(mainPipe.x, mainPipe.y, mainPipe.w, mainPipe.h);


        if(this.trackPlayer.currentAction)
        {
            sprite(this.highlight, this.currentIndicator.x * PIXEL_SCALE, this.currentIndicator.y * PIXEL_SCALE);

            let activePipe = {
                x: mainPipe.x,
                y: mainPipe.y,
                w: 1,
                h: (this.trackPlayer.currentAction.actionOrder + 1) * this.rowHeight * PIXEL_SCALE + 3
            };

            paper(this.activePipeColour);
            rectf(activePipe.x, activePipe.y, activePipe.w, activePipe.h);
        }

        let joinColour = this.pipeColour;
        if(this.trackPlayer.currentAction)
        {
            joinColour = this.activePipeColour;
        }
        paper(joinColour);
        let pipeDisplayJoin = {
            x: (this.rootPos.x + 2 * this.offm) * PIXEL_SCALE - 2,
            y: 1.5 * PIXEL_SCALE,
            w: 2,
            h: 1
        }

        if(this.offm < 0)
        {
            pipeDisplayJoin.x += PIXEL_SCALE + 2;
        }

        rectf(pipeDisplayJoin.x, pipeDisplayJoin.y, pipeDisplayJoin.w, pipeDisplayJoin.h);

        let finalY = 0;

        if(this.IsPlayerActivePlayer())
        {
            let indic = this.indicatorAnims[this.animIndex];
            sprite(indic.i, this.rootPos.x * PIXEL_SCALE, (this.rootPos.y - 1.125) * PIXEL_SCALE, indic.h, indic.v, indic.r);
        }

        for(let i = 0; i < this.length; i ++)
        {
            let filled = false;

            for(let j = 0; j < this.trackPlayer.actionQueue.length; j ++)
            {
                if(this.trackPlayer.actionQueue[j].actionOrder === i)
                {
                    filled = true;
                    break;
                }
            }

            let yPos = (this.rootPos.y + (i * this.rowHeight)) * PIXEL_SCALE;

            let spriteIndex = this.unfilled;

            if(this.trackPlayer.currentAction && this.trackPlayer.currentAction.actionOrder === i)
            {
                spriteIndex = this.highlight;
            }
            else if(filled)
            {
                spriteIndex=  this.filled;
            }

            sprite(spriteIndex, this.rootPos.x * PIXEL_SCALE, yPos);
            
            let pipeJoiner = {
                x: (this.rootPos.x + this.offm * 1) * PIXEL_SCALE,
                y: yPos + 4,
                w: 0.25 * PIXEL_SCALE,
                h: 1
            }

            if(this.offm < 0)
            {
                pipeJoiner.x += 0.5*PIXEL_SCALE + 2;
            }

            let pipeCol = this.pipeColour;

            if(this.trackPlayer.currentAction && this.trackPlayer.currentAction.actionOrder === i)
            {
                pipeCol = this.activePipeColour;
            }

            paper(pipeCol);
            rectf(pipeJoiner.x, pipeJoiner.y, pipeJoiner.w, pipeJoiner.h);

            if(this.showMoveDetails && filled)
            {
                let text = this.trackPlayer.actionQueue[i].name;

                paper(6);
                let textBacking = {
                    x: (this.rootPos.x + 1.25 * this.offm) * PIXEL_SCALE,
                    y: yPos,
                    w: text.length * 0.5* PIXEL_SCALE + 2,
                    h: 1*PIXEL_SCALE
                };

                if(this.offm < 0)
                {
                    textBacking.x -= (textBacking.w - 0.25 *PIXEL_SCALE);
                }
                
                rectf(textBacking.x, textBacking.y, textBacking.w, textBacking.h);
                print(text, textBacking.x + 1, textBacking.y + 1);
            }

            finalY = yPos + PIXEL_SCALE
        }

        if(this.trackPlayer.currentAction)
        {
            let text = this.trackPlayer.currentAction.name;

            let width = text.length * 0.5 * PIXEL_SCALE + 2;
            
            let drawAt = { x: this.currentActionPos.x * PIXEL_SCALE, y: this.currentActionPos.y * PIXEL_SCALE };

            if(this.offm < 0)
            {
                drawAt.x = this.currentActionPos.x * PIXEL_SCALE - width;
            }

            print(text, drawAt.x, drawAt.y);
        }

        for(let i = 0; i < this.trackPlayer.hp; i ++)
        {
            paper(this.healthPipColours[this.trackPlayer.hp-1]);
            //paper(this.healthPipColours[i]);
            
            let pipBaseModX = this.healthBarPip.spacing * i;

            if(this.offm < 0)
            {
                pipBaseModX =  -(this.healthBarPip.spacing) * (i);
                pipBaseModX -= 1;
            }

            let pipRect = {
                x: (this.healthbarStartPos.x + pipBaseModX) * PIXEL_SCALE,
                y: this.healthbarStartPos.y * PIXEL_SCALE,
                w: this.healthBarPip.width * PIXEL_SCALE,
                h: this.healthBarPip.height * PIXEL_SCALE
            };

            rectf(pipRect.x, pipRect.y, pipRect.w, pipRect.h);
        }

        if(this.IsPlayerActivePlayer())
        {
            paper(6);
            let undoPrompt = {
                x: this.rootPos.x * PIXEL_SCALE,
                y: finalY + 0.125 * PIXEL_SCALE,
                w: 2+ PIXEL_SCALE * 4,
                h: 2 + PIXEL_SCALE* 2
            };

            if(this.offm < 0)
            {
                undoPrompt.x -= (undoPrompt.w - 6);
            }

            rectf(undoPrompt.x, undoPrompt.y, undoPrompt.w, undoPrompt.h);
            print("Down", undoPrompt.x, undoPrompt.y);
            print("Undo", undoPrompt.x, undoPrompt.y + PIXEL_SCALE);

            if(this.trackPlayer.actionQueue.length === this.trackPlayer.maxActions)
            {
                let confirmPrompt = {
                    x: this.rootPos.x * PIXEL_SCALE,
                    y: finalY + 3.25 * PIXEL_SCALE,
                    w: 2+ PIXEL_SCALE * 4,
                    h: 2 + PIXEL_SCALE* 2
                };
                paper(6);

                if(this.offm < 0)
                {
                    confirmPrompt.x -= (confirmPrompt.w - 6);
                }

                rectf(confirmPrompt.x, confirmPrompt.y, confirmPrompt.w, confirmPrompt.h)
                print("Enter", confirmPrompt.x, confirmPrompt.y);
                print("Confirm", confirmPrompt.x, confirmPrompt.y + PIXEL_SCALE);
            }
        }
    }
}