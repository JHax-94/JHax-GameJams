import { consoleLog, EM, PIXEL_SCALE } from "../main";

export default class CameraController
{
    constructor()
    {
        this.cameraSpeed = PIXEL_SCALE * 0.5;
        EM.RegisterEntity(this);
    }   

    Input(input)
    {
        let inputVec = { x: 0, y: 0 };

        if(input.left || input.left_alt)
        {
            inputVec.x = -1;
        }
        else if(input.right || input.right_alt)
        {
            inputVec.x = 1;
        }

        if(input.up || input.up_alt)
        {
            inputVec.y = 1;
        }
        else if(input.down || input.down_alt)
        {
            inputVec.y = -1;
        }

        EM.camera.MoveBy(inputVec.x * this.cameraSpeed, inputVec.y * this.cameraSpeed);

        if(input.esc)
        {
            EM.Pause();
        }

        //EM.hudLog.push(`Move camera:  (${inputVec.x}, ${inputVec.y})`);
    }
}