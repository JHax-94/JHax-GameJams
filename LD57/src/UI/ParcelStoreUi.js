import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, TILE_HEIGHT, TILE_WIDTH } from "../main";
import MOUSE_BUTTON from "../MouseButtons";

export default class ParcelStoreUi
{
    constructor(gameWorld)
    {
        this.renderLayer = "UI";
        
        this.gameWorld = gameWorld;

        this.hovered = false;
        this.mousePos = null;
        let tileHeight = 4;

        this.panel = { x: 2, y: (TILE_HEIGHT- tileHeight) * PIXEL_SCALE - 2, w: 30 * PIXEL_SCALE, h: tileHeight * PIXEL_SCALE };

        this.slotStart = { x: 2, y: 12 };
        this.slotDims = { w: 1.5, h: 1.5 };
        this.slotSpacing = { w: 0.5, h: 0 };

        this.hoveredTile = null;

        this.largeNarr = getFont("LargeNarr");

        this.selection = [];

        EM.RegisterEntity(this);
    }

    ParcelStore()
    {
        let parcelStore = null;

        if(this.gameWorld.selected && this.gameWorld.selected.parcelStore)
        {
            parcelStore = this.gameWorld.selected.parcelStore;
        }

        return parcelStore;
    }

    Bounds()
    {
        return this.panel
    }

    Hover(hover, pos)
    {
        let parcelStore = this.ParcelStore();
        this.hovered = hover;
        this.mousePos = pos;

        if(parcelStore !== null && hover)
        {
            let hoveredTile = null;
            for(let i = 0; i < parcelStore.capacity; i ++)
            {
                let bounds = this.SlotBounds(i);

                if(this.mousePos.x >= bounds.x && this.mousePos.x <= bounds.x + bounds.w && 
                    this.mousePos.y >= bounds.y && this.mousePos.y <= bounds.y + bounds.h)
                {
                    hoveredTile = i;
                    break;
                }
            }

            if(this.hoveredTile !== hoveredTile)
            {
                this.hoveredTile = hoveredTile;
            }
        }
        else
        {
            this.hoveredTile = null;
        }
    }

    Click(button)
    {
        let parcelStore = this.ParcelStore();
        if(button === MOUSE_BUTTON.LEFT_MOUSE && this.hoveredTile !== null)
        {
            this.ToggleSelection(this.hoveredTile);
        }
    }

    ToggleSelection(index)
    {
        let indexOf = this.selection.indexOf(index);

        if(indexOf < 0)
        {
            this.selection.push(index);
        }
        else
        {
            this.selection.splice(indexOf, 1);
        }
    }

    IsSelected(index)
    {
        return this.selection.indexOf(index) >= 0;
    }

    SlotBounds(index)
    {
        let panel = this.panel;
        let slotDims = this.slotDims;
        let slotStart = this.slotStart;
        let slotSpacing = this.slotSpacing;

        let drawDims = { 
            x: panel.x + slotStart.x + (slotDims.w + slotSpacing.w) * index * PIXEL_SCALE, 
            y: panel.y + slotStart.y,
            w: slotDims.w * PIXEL_SCALE,
            h: slotDims.h * PIXEL_SCALE
        };

        return drawDims;
    }   

    ClearSelection()
    {
        this.selection = [];
    }

    Draw()
    {
        let parcelStore = this.ParcelStore();

        if(parcelStore !== null)
        {
            let panel = this.panel;

            paper(6)
            rectf(panel.x, panel.y, panel.w, panel.h);

            pen(1);
            setFont(this.largeNarr);
            print(`CARGO:`, panel.x + 2, panel.y + 2);
            setFont("Default");

            for(let i = 0; i < parcelStore.capacity; i ++)
            {
                paper(0);
                
                let drawDims = this.SlotBounds(i);
                let parcel = parcelStore.Parcel(i);

                rectf(drawDims.x, drawDims.y, drawDims.w, drawDims.h);

                if(parcel !== null)
                {
                    if(parcel.sortProgress > 0 && parcel.sorted === false)
                    {
                        paper(11);
                        rectf(drawDims.x, drawDims.y, drawDims.w * parcel.sortProgress, drawDims.h);
                    }

                    if(parcel.RemainingGrace() > 0)
                    {
                        let graceProportion = parcel.GraceProportion();

                        paper(7);
                        rectf(drawDims.x, drawDims.y, drawDims.w * graceProportion, 3);
                    }

                    let targetSymbol =parcel.TargetSymbol();
                    
                    targetSymbol._drawEnhanced(drawDims.x + (drawDims.w - targetSymbol.width) *0.5, drawDims.y + (drawDims.h - targetSymbol.height) * 0.5);

                    print(`Reward:`, drawDims.x, drawDims.y + drawDims.h + 2);
                    print(`${parcel.RewardValue()}`, drawDims.x, drawDims.y + drawDims.h + 8);
                }

                if(this.IsSelected(i))
                {
                    pen(1);
                    rect(drawDims.x, drawDims.y, drawDims.w, drawDims.h);
                }

                if(i === this.hoveredTile)
                {
                    pen(1);
                    rect(drawDims.x + 1, drawDims.y + 1, drawDims.w - 2, drawDims.h - 2);
                }
            }
        }

    }

    


}