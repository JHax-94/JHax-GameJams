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
    }

    BuildStartingPlanets()
    {
        let firstPlanet = new Planet({ x: -7, y: -6});
        let secondPlanet = new Planet({ x: 8, y: 9 });

        this.planets.push(firstPlanet);
        this.planets.push(secondPlanet);
    }

    SetupGameWorld()
    {
        let mainStation = new PostStation({ x: 0, y: 0 });

        this.stations.push(mainStation);

        this.BuildStartingPlanets();

        mainStation.FocusCamera();
    }
}