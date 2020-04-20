class BattleEndPopup
{
   constructor(pos, dims)
   {
        this.pos = pos;
        this.dims = dims;
        this.isActive = false;

        this.winnings = 0;
        this.compensation = 0;

        this.addToList();
   }

   addToList()
   {
        screens[BATTLE_SCREEN].drawablesList.push(this);
        screens[BATTLE_SCREEN].menuKeyReactors.push(this);
   }

   showBattleEnd(battleEnd)
   {
        console.log(battleEnd);

        this.winnings = battleEnd.winnings;
        this.compensation = battleEnd.compensation;

        this.isActive = true;
   }

   setBackgroundMode()
   {
        fill(color(51, 51, 51, 200));
        rectMode(CENTER);
   }

   setTextMode()
   {
       fill(255);
       noStroke();
       textAlign(CENTER, CENTER);
   }

   setContinueMode()
   {
       fill(255);
       noStroke();
       textAlign(CENTER, CENTER);
   }

   menuUp() { }

    menuDown() { }

    menuRight() { }

    menuLeft() { }

    menuSubmit()
    {
        if(this.isActive)
        {
            gameMaster.addMoney(this.winnings - this.compensation);
            nextBattle();
            setActiveScreen(PRE_BATTLE_SCREEN);
        }
    }

   draw()
   {
       if(this.isActive)
       {
            this.setBackgroundMode();
            rect(this.pos.x, this.pos.y, this.dims.w, this.dims.h);

            this.setTextMode();
            text("Winnings: " + this.winnings + " denarii", this.pos.x, this.pos.y - 30);
            text("Compensation: " + this.compensation + " denarii", this.pos.x, this.pos.y);
            text("Total: " + (this.winnings - this.compensation) + " denarii", this.pos.x, this.pos.y + 30);
            
            this.setContinueMode()
            text("Press Enter to continue...", this.pos.x, this.pos.y + this.dims.h / 2 - 40);

       }
   }
}