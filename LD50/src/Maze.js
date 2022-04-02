import { EM } from "./main";

export default class Maze
{
    constructor(levelData)
    {
        this.bg = levelData.backgroundColour;

        this.mazeMap = getMap(levelData.map);

        EM.RegisterEntity(this);
    }


    Draw()
    {
        paper(this.bg);
        cls();
        this.mazeMap.draw(0, 0);
    }
    
}