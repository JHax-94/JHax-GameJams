import InventoryItem from "./InventoryItem";
import { em } from "./main";

export default class InventoryDisplay
{
    constructor(tileRect, dataStore)
    {
        this.data = dataStore;
        this.baseTileRect = tileRect;

        this.rowSpacing = 1;

        this.oxygenDisplay = new InventoryItem(this.GetTileRect(0), 142, dataStore.GetOxygenUpgrades());
        this.boosterDisplay = new InventoryItem(this.GetTileRect(1), 158, 0);
        this.o2CanisterDisplay = new InventoryItem(this.GetTileRect(2), 126, 0);
        this.treasureMapDisplay = new InventoryItem(this.GetTileRect(3), 110, dataStore.GetMapCount());
        this.redKeyDisplay = new InventoryItem(this.GetTileRect(4), 190, dataStore.GetKeyCount("RED"));
        this.purpleKeyDisplay = new InventoryItem(this.GetTileRect(5), 206, dataStore.GetKeyCount("PURPLE"));
        this.greenKeyDisplay = new InventoryItem(this.GetTileRect(6), 222, dataStore.GetKeyCount("GREEN"));
        


    }

    GetTileRect(row)
    {
        return { x: this.baseTileRect.x, y: this.baseTileRect.y + this.rowSpacing * row };
    }
}