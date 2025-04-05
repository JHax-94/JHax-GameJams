import { consoleLog, EM, PIXEL_SCALE } from "../main";
import Planet from "./Planet";
import PostStation from "./PostStation";
import SymbolGenerator from "./SymbolGenerator";

export default class GameWorld
{
    constructor()
    {
        EM.RegisterEntity(this);

        this.stations = [];

        this.planets = [];

        this.symbolGenerator = new SymbolGenerator();
        this.selected = null;
    }

    Select(object)
    {
        this.selected = object;
    }

    SendSpacecraftTo(spacecraft, target)
    {
        spacecraft.SetTarget(target);
    }

    AttemptToSendSpacecraft(source, target)
    {
        consoleLog("Attempt to send a spacecraft from:");
        consoleLog(source);
        consoleLog("to:");
        consoleLog(target);

        let bestSpacecraft = source.GetBestSpacecraft();
            
        if(bestSpacecraft !== null)
        {
            consoleLog("Sending spacecraft:");
            consoleLog(bestSpacecraft);
            consoleLog("to:");
            consoleLog(target);

            this.SendSpacecraftTo(bestSpacecraft, target);
        }
        else
        {
            consoleLog("No spacecraft found at source:");
            consoleLog(source);
        }
    }

    PerformAction(object)
    {
        consoleLog("Perform action on object:");
        consoleLog(object);
        if(this.selected !== null)
        {
            this.AttemptToSendSpacecraft(this.selected, object);
        }   
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
        let mainStation = new PostStation({ x: 0, y: 0 }, "POST STATION 1", this, this.symbolGenerator.MainStationSymbol());

        this.stations.push(mainStation);

        mainStation.SpawnFreighter();

        this.BuildStartingPlanets();

        mainStation.FocusCamera();
    }

    Draw()
    {
        let lineHeight = 8;

        if(this.selected)
        {
            print(`${this.selected.title}`, 0, 0);

            if(this.selected.spacecraftRoster && this.selected.spacecraftRoster.length > 0)
            {
                print("Docked: ", 0, lineHeight);
                for(let i = 0; i < this.selected.spacecraftRoster.length; i ++)
                {
                    let craft = this.selected.spacecraftRoster[i];
                    print(craft.title, 0, 2 * lineHeight);
                }
            }
        }
    }
}