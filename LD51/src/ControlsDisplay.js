import { EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "./main";

export default class ControlsDisplay
{
    constructor()
    {
        EM.RegisterEntity(this);
    }

    Draw()
    {
        pen(1);
        print("Up Arrow - Move Forward", 0, (TILE_HEIGHT-3*0.75) * PIXEL_SCALE);
        print("Left Arrow - Turn Anti Clockwise", 0, 1 * (TILE_HEIGHT - 2*0.75) * PIXEL_SCALE);
        print("Right Arrow - Turn clockwise", 0, (TILE_HEIGHT - 0.75) * PIXEL_SCALE);

        print("1 - Attack", PIXEL_SCALE * TILE_WIDTH * 0.625, (TILE_HEIGHT - 3*0.75) * PIXEL_SCALE);
        print("2 - Stance Up", PIXEL_SCALE * TILE_WIDTH * 0.625, (TILE_HEIGHT - 2*0.75) * PIXEL_SCALE);
        print("3 - Stance Down", PIXEL_SCALE * TILE_WIDTH * 0.625, (TILE_HEIGHT - 0.75) * PIXEL_SCALE);
    }
}