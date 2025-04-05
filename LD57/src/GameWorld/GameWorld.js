import { EM, PIXEL_SCALE } from "../main";
import Planet from "./Planet";
import PostStation from "./PostStation";

export default class GameWorld
{
    constructor()
    {
        EM.RegisterEntity(this);

        this.stations = [];

        this.planets = [];


        this.selected = null;
    }

    Select(object)
    {
        this.selected = object;
    }

    BuildStartingPlanets()
    {
        let firstPlanet = new Planet({ x: -7, y: -6}, `Planet 0`, this);
        let secondPlanet = new Planet({ x: 8, y: 9 }, `Planet 1`, this);

        this.planets.push(firstPlanet);
        this.planets.push(secondPlanet);
    }

    SetupGameWorld()
    {
        let mainStation = new PostStation({ x: 0, y: 0 }, "POST STATION 1", this);

        this.stations.push(mainStation);

        this.BuildStartingPlanets();

        mainStation.FocusCamera();
    }

    Draw()
    {
        if(this.selected)
        {
            print(`${this.selected.title}`, 0, 0);
        }
    }
}