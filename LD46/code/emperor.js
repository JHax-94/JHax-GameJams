class Emperor
{
    constructor(startExcitement, maxExcitement)
    {
        this.THUMBS_UP = 0;
        this.THUMBS_DOWN = 1;

        this.pos = {x: width/2, y: 0 };
        this.excitement = startExcitement;
        this.maxExcitement = maxExcitement;
        
        this.prizeMoney = 0;

        var barCentre = { x: width/2, y: 40 };
        var barDims = { w: width / 2, h: 25 };
        var barPos = { x: barCentre.x - (barDims.w/2), y: barCentre.y - (barDims.h/2) };
        
        this.barRender = new Bar(barPos, barDims, {r: 255, g: 0, b: 0}, {r: 0, g: 255, b: 0});
        this.barRender.setFilled(this.excitement, this.maxExcitement);

        this.thumbsUpStartPos = { x: this.barRender.pos.x + this.barRender.dims.w + 25, y: this.barRender.pos.y + 10 };
        this.thumbsUpStartDims = { w: 30, h: 30 };

        this.thumbsDownStartPos = { x: this.barRender.pos.x - 25, y: this.barRender.pos.y + 10 };
        this.thumbsDownStartDims = { w: 30, h: 30 };

        this.thumbsUpPos = this.thumbsUpStartPos;
        this.thumbsUpDims = this.thumbsUpStartDims;

        this.thumbsDownPos = this.thumbsDownStartPos;
        this.thumbsDownDims = this.thumbsDownStartDims;
        
        this.tutorialText = "";
        this.tutorialOn = false;


        this.addToLists();
    }

    setTutorial(text)
    {
        console.log("TUTORIAL: " + text);
        this.tutorialText = text;
        if(text.length > 0 && TUTORIAL_ON)
        {
            this.tutorialOn = true;
        }
    }

    isPleased()
    {
        return this.excitement > this.maxExcitement / 2;
    }

    addToLists()
    {   
        screens[BATTLE_SCREEN].drawablesList.push(this);
    }

    setExcitement(value)
    {
        this.excitement = value;
        this.barRender.setFilled(this.excitement, this.maxExcitement);
    }

    addToExcitement(diff)
    {
        var newExcite = this.excitement + diff;

        if(newExcite > this.maxExcitement)
        {
            newExcite = this.maxExcitement;
        }
        else if(newExcite < 0)
        {
            newExcite = this.maxExcitement;
        }

        this.excitement = newExcite;
        this.barRender.setFilled(this.excitement, this.maxExcitement);
    }

    reset()
    {
        this.excitement = 400;
        this.barRender.setFilled(this.excitement, this.maxExcitement);
    }

    lerpThumb(whichThumb, targetPoint, targetScale, lerpVal)
    {
        if(whichThumb === this.THUMBS_UP)
        {
            this.thumbsUpPos = {
                x: lerp(this.thumbsUpStartPos.x, targetPoint.x, lerpVal),
                y: lerp(this.thumbsUpStartPos.y, targetPoint.y, lerpVal)
            };

            this.thumbsUpDims = {
                w: lerp(this.thumbsUpStartDims.w, this.thumbsUpStartDims.w * targetScale, lerpVal),
                h: lerp(this.thumbsUpStartDims.h, this.thumbsUpStartDims.h * targetScale, lerpVal),
            };
        }
        if(whichThumb === this.THUMBS_DOWN)
        {
            this.thumbsDownPos = {
                x: lerp(this.thumbsDownStartPos.x, targetPoint.x, lerpVal),
                y: lerp(this.thumbsDownStartPos.y, targetPoint.y, lerpVal)
            };

            this.thumbsDownDims = {
                w: lerp(this.thumbsDownStartDims.w, this.thumbsDownStartDims.w * targetScale, lerpVal),
                h: lerp(this.thumbsDownStartDims.h, this.thumbsDownStartDims.h * targetScale, lerpVal),
            };
        }
    }

    setPrizeMoneyMode()
    {
        textAlign(LEFT, TOP);
    }

    barCentreMode()
    {
        fill(0);
        noStroke();
        rectMode(CENTER);
    }

    draw()
    {
        this.barRender.draw();
        /*
        fill(255)
        textAlign(CENTER);
        noStroke();
        text(this.excitement + ' / ' + this.maxExcitement, width/2, 50);*/
        this.barCentreMode();
        rect(this.pos.x, this.barRender.pos.y + this.barRender.dims.h / 2, 3, this.barRender.dims.h + 10, 1);

        fill(0);
        textAlign(CENTER, TOP)
        if(this.tutorialText)
        {
            text(this.tutorialText, width / 2, 70);
        }

        imageMode(CENTER);
        image(thumbsDown, this.thumbsDownPos.x, this.thumbsDownPos.y, this.thumbsDownDims.w, this.thumbsDownDims.h);

        image(thumbsUp, this.thumbsUpPos.x, this.thumbsUpPos.y, this.thumbsUpDims.w, this.thumbsUpDims.h);

        if(this.prizeMoney > 0)
        {
            this.setPrizeMoneyMode();
            text("Prize Money: " + this.prizeMoney, 5, 5);
        }
    }
}