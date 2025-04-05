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
}