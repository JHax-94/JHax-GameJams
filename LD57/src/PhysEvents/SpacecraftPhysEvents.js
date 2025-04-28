import InfluenceZone from "../GameWorld/InfluenceZone";
import { consoleLog } from "../main";
import Freighter from "../Spacecraft/Freighter";
import Shuttle from "../Spacecraft/Shuttle";
import Tanker from "../Spacecraft/Tanker";
import PhysEventRegistry from "./PhysEventRegistry";

export default class SpacecraftPhysEventRegister extends PhysEventRegistry
{
    constructor()
    {
        super();
    }

    Begin_SpacecraftCelestial_Check(container, manager, evt) { return manager.CompareTags(evt, "SPACECRAFT", "CELESTIAL"); }
    Begin_SpacecraftCelestial_Resolve(container, manager, evt)
    {
        let spacecraft = container.BodyWithTag(evt, "SPACECRAFT");
        let celestial = container.BodyWithTag(evt, "CELESTIAL");

        celestial.obj.AddSpacecraft(spacecraft.obj);
    }

    End_SpacecraftCelestial_Check(container, manager, evt) { return manager.CompareTags(evt, "SPACECRAFT", "CELESTIAL"); }
    End_SpacecraftCelestial_Resolve(container, manager, evt) 
    {
        let spacecraft = container.BodyWithTag(evt, "SPACECRAFT");
        let celestial = container.BodyWithTag(evt, "CELESTIAL");

        celestial.obj.RemoveSpacecraft(spacecraft.obj);
    }

    Begin_SpacecraftSpacecraft_Check(container, manager, evt) { return manager.CompareTags(evt, "SPACECRAFT", "SPACECRAFT"); }
    Begin_SpacecraftSpacecraft_Resolve(container, manager, evt)
    {
        consoleLog("BEGIN SPACECRAFT HIT!");

        let spacecraftBods = container.BodiesWithTag(evt, "SPACECRAFT");
        
        let tanker = null;
        let freighter = null;
        let shuttle = null;

        consoleLog("Check bods:");
        consoleLog(spacecraftBods);

        for(let i = 0; i < spacecraftBods.length; i ++)
        {
            if(spacecraftBods[i].obj instanceof Freighter)
            {
                consoleLog("FREIGHER FOUND");
                freighter = spacecraftBods[i].obj;
            }
            else if(spacecraftBods[i].obj instanceof Shuttle)
            {
                consoleLog("SHUTTLE FOUND");
                shuttle = spacecraftBods[i].obj;
            }
            else if(spacecraftBods[i].obj instanceof InfluenceZone)
            {
                consoleLog("TANKER FOUND");
                tanker = spacecraftBods[i].obj;
            }        
        }

        if(tanker !== null && freighter !== null)
        {
            tanker.AddSpacecraft(freighter);
        }

        if(tanker !== null && shuttle !== null)
        {
            tanker.AddSpacecraft(shuttle);
        }
    }

    End_SpacecraftSpacecraft_Check(container, manager, evt) { return manager.CompareTags(evt, "SPACECRAFT", "SPACECRAFT"); }
    End_SpacecraftSpacecraft_Resolve(container, manager, evt) 
    {
        consoleLog("END SPACECRAFT HIT!");

        let spacecraftBods = container.BodiesWithTag(evt, "SPACECRAFT");
        
        let tanker = null;
        let freighter = null;

        for(let i = 0; i < spacecraftBods.length; i ++)
        {
            if(spacecraftBods[i].obj instanceof Freighter)
            {
                freighter = spacecraftBods[i].obj;
            }
            else if(spacecraftBods[i].obj instanceof InfluenceZone)
            {
                tanker = spacecraftBods[i].obj;
            }        
        }

        if(tanker !== null && freighter !== null)
        {
            tanker.RemoveSpacecraft(freighter);
        }
    }
}