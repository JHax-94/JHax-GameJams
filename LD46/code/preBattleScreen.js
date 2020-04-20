class PreBattleScreen
{
    constructor(pos, dims, startSelected, shopInfo, techniqueInfo)
    {
        this.pos = pos;
        this.dims = dims;

        this.topLeft = { x: this.pos.x - this.dims.w/2, y: this.pos.y - this.dims.h/2 };

        this.moneyPos = { x: this.topLeft.x + this.dims.w/6, y: this.topLeft.y + 115 };
        this.healthPos = { x: this.pos.x, y: this.topLeft.y + 115 };

        this.selectedPanel = -1;
        this.panels = [];

        var panelOffset = dims.w / 3;

        var shopPanelObj = { 
            title: "Shop",
            isCentered: false,
            menu: []        
        };
        
        var hasWoodenGladius = false;

        for(var i = 0; i < shopInfo.shopItems.length; i ++)
        {
            if(shopInfo.shopItems[i].owned)
            {
                if(shopInfo.shopItems[i].name === "Wooden Gladius")
                {
                    hasWoodenGladius = true;
                }
            }
            else
            {
                var shopEntry = {
                    hasPrice: true,
                    label: shopInfo.shopItems[i].name,
                    price: shopInfo.shopItems[i].price,
                    masterIndex: i,
                    command: "BUY"
                }
    
                shopPanelObj.menu.push(shopEntry)
            }
        }

        var fightPanelObj = { 
            title: "Fight",
            isCentered: true,
            menu: [{
                hasPrice: false,
                label: "Begin fight!!",
                command: "FIGHT"
            },
            {
                hasPrice: false,
                label: "Prepare for battle",
                command: "LOADOUT"
            }] 
        };

        if(hasWoodenGladius)
        {
            this.addRetireOption(fightPanelObj);
        }

        var trainingPanelObj = { 
            title: "Training",
            isCentered: false,
            menu: []
        }; 

        for(var i = 0; i < techniqueInfo.techniques.length; i ++ )
        {
            if(!techniqueInfo.techniques[i].owned)
            {
                var trainingEntry = {
                    hasPrice: true,
                    label: techniqueInfo.techniques[i].name,
                    price: techniqueInfo.techniques[i].price,
                    masterIndex: i,
                    command: "LEARN"
                }
    
                trainingPanelObj.menu.push(trainingEntry);
            }
        }

        var panelDims = { w: panelOffset-20 , h: (this.dims.h / 3) };
        var centrePanelDims = { w: panelDims.w, h: 0.75 * this.dims.h }

        var shopPanel = new PreBattlePanel({ x: this.pos.x - panelOffset, y: this.pos.y + panelDims.h }, panelDims, shopPanelObj);
        var fightPanel = new PreBattlePanel({ x: this.pos.x, y: this.pos.y + centrePanelDims.h/2 }, centrePanelDims, fightPanelObj, 1);
        var trainingPanel = new PreBattlePanel({ x: this.pos.x + panelOffset, y: this.pos.y + panelDims.h }, panelDims, trainingPanelObj);

        this.panels.push(shopPanel);
        this.panels.push(fightPanel);
        this.panels.push(trainingPanel);

        this.select(startSelected);
        this.panels[startSelected].resetSelection()
        this.addToLists();
    }

    addRetireOption(targetPanel)
    {
        var retire = {
            hasPrice: false,
            label: "Retire",
            command: "RETIRE"
        }

        if(targetPanel.menu)
        {
            targetPanel.menu.push(retire);
        }
        else 
        {
            targetPanel.subMenu.push(retire);
        }
        
    }

    resetSelection(menu)
    {
        this.select(menu);
        this.panels[menu].resetSelection();
    }

    addToLists()
    {
        screens[PRE_BATTLE_SCREEN].menuKeyReactors.push(this);
        screens[PRE_BATTLE_SCREEN].drawablesList.push(this);
    }

    select(panelNo)
    {
        if(this.selectedPanel >= 0)
        {
            this.panels[this.selectedPanel].selected = false;   
        }

        this.panels[panelNo].selected = true;

        this.selectedPanel = panelNo;
    }

    menuUp()
    {
        this.panels[this.selectedPanel].menuUp();
    }

    menuDown()
    {
        this.panels[this.selectedPanel].menuDown();
    }

    menuRight()
    {
        this.select(mod(this.selectedPanel + 1, this.panels.length));
    }

    menuLeft()
    {
        this.select(mod(this.selectedPanel - 1, this.panels.length));
    }

    menuSubmit()
    {
        var subMenu = this.panels[this.selectedPanel].selectedItem();

        console.log("selected sub menu....");
        console.log(subMenu);

        if(subMenu !== 0)
        {
            if(subMenu.command === "FIGHT")
            {
                console.log("Start fight!");
                setActiveScreen(BATTLE_SCREEN);
            }
            else if(subMenu.command === "LOADOUT")
            {
                console.log("Go to loadout screen! (" + subMenu.command + ")");
                setActiveScreen(LOADOUT_SCREEN);
            }
            else if(subMenu.command === "LEARN")
            {
                console.log("=== Learn ===");
                if(this.canPurchase(gameMaster.money, subMenu.price) && !subMenu.owned)
                {
                    gameMaster.money -= subMenu.price;
                    this.panels[this.selectedPanel].setOwned();
                    buyTech(subMenu.label);
                }
            }
            else if(subMenu.command === "BUY")
            {
                console.log("=== Buy ===");
                if(this.canPurchase(gameMaster.money, subMenu.price))
                {
                    gameMaster.money -= subMenu.price;
                    this.panels[this.selectedPanel].setOwned();
                    buyItem(subMenu.label);
                    if(subMenu.label === "Wooden Gladius")
                    {
                        this.addRetireOption(this.panels[1]);
                    }
                }
            }
            else if(subMenu.command === "RETIRE")
            {
                console.log("=== Retire ===")
                END_STATE = {
                    endStateTitle: "Congratulations!\nYou have retired to a long and peaceful life!"
                };
                setActiveScreen(GAME_END);
            }
        }
    }

    canPurchase(currentMoney, itemPrice)
    {
        return itemPrice <= currentMoney;
    }

    setWindowDrawMode()
    {
        fill(color(51, 51, 51, 200));
        rectMode(CENTER);
    }

    setTextMode()
    {
        textAlign(CENTER);
        fill(255);
        noStroke();
    }

    draw()
    {
        /*
        this.setWindowDrawMode();
        rect(this.pos.x, this.pos.y, this.dims.w, this.dims.h);
        */
        this.setTextMode();
        text("Money: " + gameMaster.money + " denarii", this.moneyPos.x, this.moneyPos.y);
        text("HP: " + gameMaster.playerHealth() + " / " + gameMaster.playerMaxHealth(), this.healthPos.x, this.healthPos.y);

        for(var i = 0; i < this.panels.length; i ++)
        {
            this.panels[i].draw();
        }
    }
}