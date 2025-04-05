import { EM, PIXEL_SCALE } from "../main";
import PostStation from "./PostStation";

export default class GameWorld
{
    constructor()
    {
        EM.RegisterEntity(this);

        this.stations = [];

        this.planets = [];
    }

    SetupGameWorld()
    {
        let mainStation = new PostStation({ x: 0, y: 0 });

        this.stations.push(mainStation);

        mainStation.FocusCamera();
    }
}