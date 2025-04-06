import ParcelStore from "../GameWorld/ParcelStore";
import Spacecraft from "./Spacecraft";

export default class Freighter extends Spacecraft
{
    constructor(atStation, title, gameWorld)
    {
        super(atStation, title, gameWorld, 0);
        this.parcelStore = new ParcelStore(this, 3);
        this.maxFuel = 200;
        this.fuel = this.maxFuel;
    }
}
