class MoveList
{
    constructor(techniques)
    {
        this.TOP_LEVEL = 0;
        this.MOVES = 1;
        this.WEAPONS = 2;
        this.TARGET_SELECT = 3;

        this.menuMode = 0;

        this.isActive = false;
        this.techniques = techniques;
        
        this.pos = { x: 50, y: height/2+60 };
        this.dims = { w: 300, h: 120 };

        this.topMenu = [ "Moves", "Change Weapon" ];

        this.selectedItem = 0;

        this.equippedTech = [];
        this.equippedWeapons = [];
        this.activeList = this.topMenu;

        this.enemyPositions = [];

        this.addToLists();
    }

    setEquippedTechs(playerTechs)
    {
        this.techniques = playerTechs;

        this.equippedTech = [];

        for(var i = 0; i < this.techniques.length; i ++)
        {
            if(this.techniques[i].equipped)
            {
                this.equippedTech.push(this.techniques[i]);
            }
        }

        console.log("Build equipped list...");
        console.log(this.equippedTech);
    }

    setEquippedWeapons(playerWeapons)
    {
        this.weapons = playerWeapons;

        this.updateEquippedWeaponsList();
    }

    updateEquippedWeaponsList()
    {
        this.equippedWeapons = [];

        var weapon = getActiveWeapon();

        console.log("Active Weapons: " + weapon);
        console.log(this.weapons);

        for(var i = 0; i < this.weapons.length; i ++)
        {
            if(this.weapons[i].equipped && !this.weapons[i].active)
            {
                this.equippedWeapons.push(this.weapons[i]);
            }
        }
    }

    nudge()
    {
        this.updateMode(this.menuMode);
    }

    updateMode(newMode)
    {
        console.log("Setting mode to: " + newMode);
        this.menuMode = newMode;
        this.selectedItem = 0;

        if(newMode === this.TOP_LEVEL)
        {
            this.activeList = this.topMenu;
        }
        else if(newMode === this.MOVES)
        {
            this.activeList = this.equippedTech;
        }
        else if(newMode === this.WEAPONS)
        {
            this.activeList = this.equippedWeapons;
        }
        else if(newMode === this.TARGET_SELECT)
        {
            this.activeList = this.enemyPositions;
            if(!this.checkValidTarget())
            {
                this.menuDown();
            }
        }
        console.log(this.activeList);
    }

    addToLists()
    {
        screens[BATTLE_SCREEN].drawablesList.push(this);
        screens[BATTLE_SCREEN].menuKeyReactors.push(this);
    }

    setToTextDrawMode()
    {
        fill(255);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(16)                
    }

    setSelectMode()
    {
        rectMode(CORNER);
        noFill();
        stroke(255);
    }

    setToContainerDrawMode()
    {
        fill(0);
        stroke(255);
        rectMode(CORNER);
    }


    modeBack()
    {
        if(this.menuMode === this.TARGET_SELECT)
        {
            this.updateMode(this.MOVES);
        }
        else if(this.menuMode != this.TOP_LEVEL)
        {
            this.updateMode(this.TOP_LEVEL);
        }
    }

    menuRight()
    {
        this.modeBack();
    }

    menuLeft()
    {
        this.modeBack();
    }

    setToSelectedItemBox()
    {
        rectMode(CORNER);
        fill(0);
        stroke(255);
    }

    checkValidTarget()
    {
        var index = this.enemyPositions[this.selectedItem].index;

        var target = gameMaster.enemies[index];
        
        return target.canTakeTurns;
    }

    menuUp()
    {
        if(this.isActive)
        {
            this.selectedItem = mod(this.selectedItem - 1, this.activeList.length);

            if(this.menuMode === this.TARGET_SELECT)
            {
                if(this.checkValidTarget() === false)
                {
                    this.menuUp();
                }
            }   

            console.log("new selected item: " + this.selectedItem);
        }
    }

    menuDown()
    {
        if(this.isActive)
        {
            this.selectedItem = mod(this.selectedItem + 1, this.activeList.length);
            
            if(this.menuMode === this.TARGET_SELECT)
            {
                if(this.checkValidTarget() === false)
                {
                    this.menuDown();
                }
            }   

            console.log("new selected item: " + this.selectedItem);
        }
    }

    menuBack()
    {
        this.modeBack();
    }

    menuSubmit()
    {
        if(this.isActive)
        {
            if(this.menuMode === this.MOVES)
            {
                var selectedTech = this.equippedTech[this.selectedItem];
                var target = 0;

                if(selectedTech.hasSpeech)
                {
                    var chosenSpeech = selectedTech.speeches[randomNum(0, selectedTech.speeches.length)];
                    this.owner.setSpeech(chosenSpeech);
                }

                console.log(this.owner);
                if(selectedTech.needsTarget)
                {
                    console.log("set target...");
                    this.enemyPositions = gameMaster.getEnemyPositions();

                    this.storedTech = selectedTech;

                    this.updateMode(this.TARGET_SELECT);
                }
                else
                {
                    gameMaster.startTechnique(selectedTech, target, this.owner);
                }
            }
            else if(this.menuMode === this.TARGET_SELECT)
            {
                var target = this.enemyPositions[this.selectedItem].index;

                this.updateMode(this.MOVES);
                gameMaster.startTechnique(this.storedTech, target, this.owner);
            }
            else if(this.menuMode === this.WEAPONS)
            {
                /*
                console.log("- CHANGE WEAPON SUBMIT -");
                console.log("selected index " + this.selectedItem);
                console.log(this.weapons);*/
                var selectedWeapon = this.equippedWeapons[this.selectedItem];
                
                //console.log(selectedWeapon);
                var changeWeapon = {
                    moveToCentre: false,
                    changeWeapon: true,
                    newWeapon: selectedWeapon.name
                };

                this.updateMode(this.TOP_LEVEL);

                gameMaster.startTechnique(changeWeapon, 0, this.owner);
            }
            else if(this.menuMode === this.TOP_LEVEL)
            {
                this.updateMode(this.selectedItem + 1);
            }            
        }
    }

    setActive(activeState)
    {
        this.isActive = activeState;
    }

    drawSelectedBox(index)
    {
        if(this.selectedItem == index)
        {
            this.setSelectMode();
            rect(this.pos.x + 10, this.pos.y + 30 + index * 20, this.dims.w - 20, 17);
            this.setToTextDrawMode();
        }
    }

    targetTriangle()
    {
        fill(255, 0, 0);
        stroke(0);
    }

    setTargetDetailsMode()
    {
        textAlign(RIGHT, CENTER);
        fill(0);
        noStroke();
    }

    menuBack() { }

    draw()
    {
        if(this.isActive)
        {
            if(this.menuMode !== this.TARGET_SELECT)
            {
                this.setToContainerDrawMode();
                rect(this.pos.x, this.pos.y, this.dims.w, this.dims.h, 20);
            }

            this.setToTextDrawMode();
            if(this.menuMode === this.TOP_LEVEL)
            {
                for(var i = 0; i < this.topMenu.length; i ++)
                {
                    this.drawSelectedBox(i);

                    text(this.topMenu[i], this.pos.x + 15, this.pos.y + 41 + (i)*20);
                }
            }
            else if(this.menuMode === this.TARGET_SELECT)
            {
                var targetPosition = this.enemyPositions[this.selectedItem];
                var target = gameMaster.enemies[targetPosition.index];

                var tough = target.getToughRating();
                var will = target.getWillRating();
                var damage = target.getDamageRating();
                var comp = target.getCompensation();

                this.targetTriangle();

                var offset = { x: -30, y: 0 };

                var point = { x: targetPosition.x + offset.x, y: targetPosition.y + offset.y };
                var top = { x: targetPosition.x - 30 + offset.x, y: targetPosition.y - 15 + offset.y };
                var bottom = { x: targetPosition.x - 30 + offset.x, y: targetPosition.y + 15 + offset.y };

                triangle(point.x, point.y, bottom.x, bottom.y, top.x, top.y);

                this.setTargetDetailsMode();

                text(tough, top.x - 10, point.y- 30);
                text(will, top.x - 10, point.y-10);
                text(damage, top.x - 10, point.y + 10);
                text(comp, top.x-10, point.y + 30);
            }
            else
            {
                if(this.menuMode === this.MOVES)
                {
                    text("DMG", this.pos.x + (this.dims.w/2), this.pos.y + 15);
                    text("EXC", this.pos.x + 1.5*(this.dims.w/2), this.pos.y + 15);
                }

                if(this.activeList.length > 0)
                {
                    for(var i = 0; i < this.activeList.length; i ++)
                    {
                        this.drawSelectedBox(i);
                        text(this.activeList[i].name, this.pos.x + 15, this.pos.y + 40 + i * 20);

                        if(this.menuMode === this.MOVES)
                        {
                            var dmg = this.activeList[i].getDamageString();
                            var exc = this.activeList[i].getExcitementString();

                            text(dmg, this.pos.x + (this.dims.w/2), this.pos.y + 40 + i * 20);
                            text(exc, this.pos.x + 1.5*(this.dims.w/2), this.pos.y + 40 + i * 20);
                        }
                    }
                }
                else
                {
                    textAlign(CENTER);
                    text("None Available!", this.pos.x + (this.dims.w / 2), this.pos.y + (this.dims.h / 2));
                }
            }
        }        
    }
}