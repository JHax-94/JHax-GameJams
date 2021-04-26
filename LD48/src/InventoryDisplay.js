import InventoryItem from "./InventoryItem";
import { em, JET_SPRITE, TOP_UP_SPRITE } from "./main";

export default class InventoryDisplay
{
    constructor(tileRect, dataStore)
    {
        this.data = dataStore;
        this.baseTileRect = tileRect;

        this.rowSpacing = 1;

        this.oxygenDisplay = new InventoryItem(this.GetTileRect(0), 142, dataStore.GetOxygenUpgrades(), true);
        this.o2CanisterDisplay = new InventoryItem(this.GetTileRect(2), TOP_UP_SPRITE, dataStore.GetOxygenTopUps(), true);
        this.treasureMapDisplay = new InventoryItem(this.GetTileRect(1), 110, dataStore.GetMapCount(), true);

        if(dataStore.GetJetCount() > 0) this.boosterDisplay = new InventoryItem(this.GetTileRect(4), JET_SPRITE, dataStore.GetJetCount(), false);
        if(dataStore.GetKeyCount("RED") > 0) this.redKeyDisplay = new InventoryItem(this.GetTileRect(5), 190, dataStore.GetKeyCount("RED"), false);
        if(dataStore.GetKeyCount("PURPLE") > 0) this.purpleKeyDisplay = new InventoryItem(this.GetTileRect(6), 206, dataStore.GetKeyCount("PURPLE"), false);
        if(dataStore.GetKeyCount("GREEN") > 0) this.greenKeyDisplay = new InventoryItem(this.GetTileRect(7), 222, dataStore.GetKeyCount("GREEN"), false);
    }

    GetTileRect(row)
    {
        return { x: this.baseTileRect.x, y: this.baseTileRect.y + this.rowSpacing * row };
    }
}