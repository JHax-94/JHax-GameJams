import UpgradeProcessor from "../GameWorld/UpgradeProcessor";
import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main";
import MOUSE_BUTTON from "../MouseButtons";

export default class ShopUi
{
    constructor(gameWorld)
    {
        this.renderLayer = "UI";
        this.gameWorld = gameWorld;
        let tileHeight = 4;

        this.upgradeProcessor = new UpgradeProcessor();

        this.minHeight = tileHeight * PIXEL_SCALE;

        this.panel = { 
            x: 4 + 30 * PIXEL_SCALE, 
            y: this.CalcPanelY(this.minHeight),
            w: 18 * PIXEL_SCALE - 6, 
            h: this.minHeight
        };

        this.upgradeBankStart = { x: 2, y: 16 };
        this.upgradeBankSpacing = { y: 26 };

        this.upgradeButtonWidth = 7 * PIXEL_SCALE;
        
        this.buttonDims = { 
            w: 4,
            h: 1
        };

        this.hovered = false;
        this.hoveredUpgrade = null;

        this.toggleFullHovered = false;

        this.fullView = false;

        this.largeNarrFont = getFont("LargeNarr");
        this.defaultFont = getFont("Default");

        EM.RegisterEntity(this);
    }

    CalcPanelY(height)
    {
        return TILE_HEIGHT * PIXEL_SCALE - height - 2;
    }

    SelectedItem()
    {
        let selected = null;

        if(this.gameWorld.selected && (this.gameWorld.selected.AvailableUpgrades || this.gameWorld.selected.nextUpgradeUnlock))
        {
            let upgrades = this.gameWorld.selected.AvailableUpgrades();
            if(upgrades.length > 0 || this.gameWorld.selected.nextUpgradeUnlock)
            {
                selected = this.gameWorld.selected;
            }
        }
        
        return selected;
    }

    ShowMoreDims()
    {
        return {
            x: this.panel.x + this.panel.w - 2 - this.buttonDims.w * PIXEL_SCALE,
            y: this.panel.y + 2,
            w: this.buttonDims.w * PIXEL_SCALE,
            h: 0.75 * PIXEL_SCALE
        };
    }

    Hover(hover, mousePos)
    {
        this.hovered = hover;

        if(hover && this.SelectedItem() !== null)
        {
            if(EM.OverlapsBounds(this.ShowMoreDims(), mousePos.x, mousePos.y))
            {
                this.toggleFullHovered = true;
            }
            else
            {
                this.toggleFullHovered = false;
            }

            if(this.toggleFullHovered === false)
            {
                let selected = this.SelectedItem();

                let upgrades = selected.AvailableUpgrades();

                this.hoveredUpgrade = null;

                for(let i = 0; i < upgrades.length; i ++)
                {
                    if(EM.OverlapsBounds(this.UpgradeButtonDims(i), mousePos.x, mousePos.y))
                    {
                        this.hoveredUpgrade = i;
                    }
                }
            }
        }
    }

    CalculateUpgradeLines(selectedItem)
    {
        let upgrades = selectedItem.AvailableUpgrades();

        return upgrades.length + (selectedItem.nextUpgradeUnlock !== null ? 1 : 0);
    }

    SetFullView(setTo)
    {
        if(setTo)
        {
            let item = this.SelectedItem();
            let nUpgrades = this.CalculateUpgradeLines(item);

            let neededHeight = this.upgradeBankStart.y + nUpgrades * this.upgradeBankSpacing.y;

            this.panel.y = this.CalcPanelY(neededHeight);
            this.panel.h = neededHeight;
        }
        else
        {
            this.panel.y = this.CalcPanelY(this.minHeight);
            this.panel.h = this.minHeight;
        }
        this.fullView = setTo;
        this.toggleFullHovered = false;
        this.hovered = false;
    }

    Click(button)
    {
        if(button === MOUSE_BUTTON.LEFT_MOUSE)
        {  
            if(this.toggleFullHovered)
            {
                this.SetFullView(!this.fullView);
            }
            else if(this.hoveredUpgrade !== null)
            {
                let selectedItem = this.SelectedItem();
                let upgrades = selectedItem.AvailableUpgrades();
                
                this.upgradeProcessor.ProcessUpgrade(upgrades[this.hoveredUpgrade], selectedItem);
                selectedItem.RemoveUpgrade(upgrades[this.hoveredUpgrade]);
                this.hoveredUpgrade = null;
            }
        }
    }

    Bounds()
    {
        return this.panel;
    }

    UpgradeButtonDims(index)
    {
        let dims = {
            x: this.panel.x + this.upgradeBankStart.x + this.upgradeButtonWidth + 2 + UTIL.GetTextWidth("UPKEEP: 99999 ", this.largeNarrFont) * PIXEL_SCALE,
            y: this.panel.y + this.upgradeBankStart.y + index * (this.upgradeBankSpacing.y) - 1,
            w: this.buttonDims.w * PIXEL_SCALE,
            h: this.buttonDims.h * PIXEL_SCALE
        }

        return dims;
    }

    Draw()
    {
        let selected = this.SelectedItem();
        if(selected !== null)
        {
            setFont(this.largeNarrFont);
            paper(6);
            rectf(this.panel.x, this.panel.y, this.panel.w, this.panel.h);

            pen(1);
            print("UPGRADES:", this.panel.x + 2, this.panel.y + 2);

            let upgrades = selected.AvailableUpgrades();

            let upgradeLines = this.CalculateUpgradeLines(selected);

            let nShowUpgrades = upgradeLines;

            let canShowMore = upgradeLines > 2 && this.fullView === false;

            EM.hudLog.push(`Upgrade lines: ${upgradeLines}`);

            if(canShowMore)
            {
                nShowUpgrades = 2;

                let showMore = this.ShowMoreDims();

                paper(14);
                rectf(showMore.x, showMore.y, showMore.w, showMore.h);
                pen( this.toggleFullHovered ? 15 : 13);
                rect(showMore.x, showMore.y, showMore.w, showMore.h);

                print(
                    "SHOW MORE", 
                    showMore.x + (showMore.w - UTIL.GetTextWidth("Show More", this.largeNarrFont) * PIXEL_SCALE) * 0.5, 
                    showMore.y + (showMore.h - UTIL.GetTextHeight("Show More", this.largeNarrFont) * PIXEL_SCALE) * 0.5);
            }
            else if(this.fullView)
            {
                let showMore = this.ShowMoreDims();

                paper(14);
                rectf(showMore.x, showMore.y, showMore.w, showMore.h);
                pen( this.toggleFullHovered ? 15 : 13);
                rect(showMore.x, showMore.y, showMore.w, showMore.h);

                print(
                    "SHOW LESS", 
                    showMore.x + (showMore.w - UTIL.GetTextWidth("Show More", this.largeNarrFont) * PIXEL_SCALE) * 0.5, 
                    showMore.y + (showMore.h - UTIL.GetTextHeight("Show More", this.largeNarrFont) * PIXEL_SCALE) * 0.5);
            }
        
            let baseX = this.panel.x + this.upgradeBankStart.x;
            let innerYSpace= UTIL.GetTextHeight("BONK", this.largeNarrFont) * PIXEL_SCALE + 2;
            let costLineX = baseX + this.upgradeButtonWidth + 2;

            EM.hudLog.push(`nShowUpgrades: ${nShowUpgrades}`);

            for(let i = 0; i < nShowUpgrades; i ++)
            {
                if(i < upgrades.length)
                {
                    let lineY = this.panel.y + this.upgradeBankStart.y + i * (this.upgradeBankSpacing.y);
                    
                    pen(1);
                    for(let j = 0; j < upgrades[i].text.length; j ++)
                    {
                        print(upgrades[i].text[j].toUpperCase(), baseX, lineY + j * innerYSpace);
                    }
                    print('COST:', costLineX, lineY);
                    print(upgrades[i].cost, costLineX + UTIL.GetTextWidth("UPKEEP: ", this.largeNarrFont) * PIXEL_SCALE, lineY);
                    print("UPKEEP:", costLineX, lineY + innerYSpace);
                    print(upgrades[i].upkeep, costLineX + UTIL.GetTextWidth("UPKEEP: ", this.largeNarrFont) * PIXEL_SCALE, lineY + innerYSpace);

                    
                    let uButtonDims = this.UpgradeButtonDims(i);
                    
                    paper(14);
                    rectf(uButtonDims.x, uButtonDims.y, uButtonDims.w, uButtonDims.h);
                    
                    pen(i === this.hoveredUpgrade ? 15 : 13);
                    rect(uButtonDims.x, uButtonDims.y, uButtonDims.w, uButtonDims.h);

                    print(
                        "BUY", 
                        uButtonDims.x + (this.buttonDims.w - UTIL.GetTextWidth("BUY", this.largeNarrFont)) *0.5 *PIXEL_SCALE,
                        uButtonDims.y + (this.buttonDims.h - UTIL.GetTextHeight("BUY", this.largeNarrFont)) *0.5* PIXEL_SCALE);

                }
                else if(selected.nextUpgradeUnlock)
                {
                    pen(1);
                    let nextUpgradeUnlock = selected.nextUpgradeUnlock;

                    let lineY = this.panel.y + this.upgradeBankStart.y + i * (this.upgradeBankSpacing.y);
                    
                    let lastY = 0;

                    for(let i = 0; i < selected.nextUpgradeUnlock.text.length; i ++)
                    {
                        lastY = lineY + i * innerYSpace;
                        //consoleLog(`${selected.nextUpgradeUnlock.text[i]} @ ${baseX}, ${lineY}`)
                        print(selected.nextUpgradeUnlock.text[i].toUpperCase(), baseX, lineY + i * innerYSpace);
                    }

                    let progress = nextUpgradeUnlock.checkProgress() - nextUpgradeUnlock.startsAt;
                    let target = nextUpgradeUnlock.target;

                    print(`${progress} / ${target - nextUpgradeUnlock.startsAt}`, costLineX, lastY);
                }
            }
            /*
            if(selected.nextUpgradeUnlock)
            {
                
            }*/
        }
    }
    
}