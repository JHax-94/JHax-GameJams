import { consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main";
import EndScreen from "./EndScreen";

export default class VictoryScreen extends EndScreen
{
    constructor()
    {
        super("Victory!");

        this.endText = [ "The colony has been", "successfully relocated!" ];

        this.lerpTime = 1;
        this.lerpTimer = 0;

        this.waitTime = 2;
        this.waitTimer = 0;

        this.cameraTarget = this.GetTargetLocation();
        this.cameraBase = { x: EM.camera.x, y: EM.camera.y };
    }

    GetTargetLocation()
    {
        let endHive = EM.GetEntity("END_HIVE");

        let hWidth = 0.5 * TILE_WIDTH * PIXEL_SCALE;
        let hHeight = 0.5 * TILE_HEIGHT * PIXEL_SCALE;

        return { x: endHive.phys.position[0] - hWidth, y: endHive.phys.position[1] + hHeight };
    }


    Update(deltaTime)
    {
        this.targetLocation = this.GetTargetLocation();

        let lerpFactor = this.lerpTimer / this.lerpTime;

        if(this.lerpTimer < this.lerpTime)
        {
            this.lerpTimer += deltaTime;

            if(this.lerpTimer > this.lerpTime)
            {
                this.lerpTimer = this.lerpTime;
            }

            lerpFactor = this.lerpTimer / this.lerpTime;

            let lerpCam = { 
                x: Math.round(this.cameraBase.x + (this.targetLocation.x - this.cameraBase.x) * lerpFactor), 
                y: Math.round(this.cameraBase.y + (this.targetLocation.y - this.cameraBase.y) * lerpFactor),
            }

            EM.camera.MoveTo(lerpCam.x, lerpCam.y);

            if(this.lerpTimer > this.lerpTime)
            {
                this.lerpTimer = this.lerpTime;
            }
        }
        
        if(this.lerpTimer >= this.lerpTime && this.waitTimer < this.waitTime)
        {
            this.waitTimer += deltaTime;
            
            if(this.waitTimer >= this.waitTime)
            {
                this.waitTimer = this.waitTime;

                this.BuildButtons([ { text: "PLAY AGAIN", callback: this.Restart } ]);
            }
        }
    }

    Draw()
    {
        if(this.waitTimer >= this.waitTime)
        {
            super.Draw();

            for(let i = 0; i < this.endText.length; i ++)
            {
                this.DrawCentredText(this.endText[i], 3 + i);
            }
        }
    }
}