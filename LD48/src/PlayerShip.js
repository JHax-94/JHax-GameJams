import { em } from "./main";

export default class PlayerShip
{
    constructor(chart, chartPos)
    {
        this.spriteIndex = 106;
        this.chartPos = chartPos;
        this.chart = chart;

        em.AddRender(this);
    }

    SetChartPos(x, y)
    {
        this.chartPos.x = x;
        this.chartPos.y = y;
    }

    Draw()
    {
        var position = this.chart.GetMapTileScreenPosition(this.chartPos.x, this.chartPos.y);

        sprite(this.spriteIndex, position.x, position.y);
    }


}