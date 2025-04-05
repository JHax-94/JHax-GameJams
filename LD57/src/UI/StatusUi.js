import { EM, getFont, PIXEL_SCALE, setFont } from "../main";

export default class StatusUi
{
    constructor(gameWorld)
    {
        this.gameWorld = gameWorld;

        this.font = getFont("LargeNarr");
        EM.RegisterEntity(this);
    }

    WeekString(week)
    {
        let str = "";

        if(week < 10)
        {
            str = `0${week}`;
        }
        else 
        {
            str = `${week}`;
        }

        return str;
    }

    Draw()
    {
        setFont(this.font);
        
        pen(1);
        print(`Star date/ ${this.gameWorld.starEra}/${this.gameWorld.starYear}-${this.WeekString(this.gameWorld.starWeek)}-${this.gameWorld.starDay}`, 2, 2);

        print(`Station Upkeep: ${this.gameWorld.StationsUpkeep()}`, 16 * PIXEL_SCALE, 2);
        print(`Spacecraft Upkeep: ${this.gameWorld.SpacecraftUpkeep()}`, 30 * PIXEL_SCALE, 2);
        print(`Credits: ${this.gameWorld.player.credits}`, 2, 12);
        
        print(`Delivered: ${this.gameWorld.player.parcelsDelivered}`, 2 + 9 * PIXEL_SCALE, 12);
        /*
        pen(9);
        print(`Weekly Upkeep: ${this.gameWorld.CalculateWeeklyUpkeep()}`, 2, 18);*/

        setFont("Default");
    }

}