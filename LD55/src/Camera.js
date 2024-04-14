export default class Camera
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }

    MoveBy(x, y)
    {
        this.x += x;
        this.y += y;
        this.UpdateCameraPos();
    }

    MoveTo(x, y)
    {
        this.x = x;
        this.y = y;
        this.UpdateCameraPos();
    }

    UpdateCameraPos()
    {
        camera(this.x, this.y);
    }
}