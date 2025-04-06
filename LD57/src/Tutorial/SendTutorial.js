import Planet from "../GameWorld/Planet";
import { EM, TILE_HEIGHT } from "../main";
import Freighter from "../Spacecraft/Freighter";
import TutorialItem from "./TutorialItem";

export default class SendTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { y: (TILE_HEIGHT / 2)-6, h: 7.5, w: 12 });

        this.timer = 2;

        this.targetPlanet = this.GetPlanetWithCargo();
    }

    GetPlanetWithCargo()
    {
        let planets = this.control.gameWorld.planets;

        let planet = null;

        for(let i = 0; i < planets.length; i ++)
        {
            if(planets[i].parcelStore.Count() > 0)
            {
                planet = planets[i];
                break;
            }
        }

        return planet;
    }

    DrawTutorial()
    {
        if(this.targetPlanet)
        {
            this.DrawWindow({ obj: this.targetPlanet, off: { x: -this.dims.w * 0.75 } });

            pen(1);
            this.DrawCentredText("Right click on a planet", 0.5);
            this.DrawCentredText("to send your freighter", 1.5);
            this.DrawCentredText("Planets with cargo ready to", 3);
            this.DrawCentredText("deliver have this symbol", 4);
            this.DrawCentredText("beneath them", 5)
            this.DrawCentredSprite(32, 6);
            //this.DrawGridCentred(this.arrowGrid, this.dims.y + 3);
        }
        else 
        {
            this.targetPlanet = this.GetPlanetWithCargo();
        }
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;
        
        if(this.Selected() !== null && this.Selected() instanceof Freighter)
        {
            if(this.Selected().target instanceof Planet)
            {
                let target = this.Selected().target;

                if(target.parcelStore.Count() > 0)
                {
                    this.timer -= deltaTime;

                    if(this.timer <= 0)
                    {
                        end = true;
                    }
                }
            }
        }
        
        return end;
    }
}