import p2, { Ray, RaycastResult, vec2 } from "p2";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, UTIL, utils } from "../main";

export default class PerceptionRay
{
    constructor(phys, dirVec, distance, ignoreOffscreen, collisionMask, landmassEdgeDetect)
    {
        this.corePhys = phys;
        let normDir = [0, 0];

        this.collisionMask = COLLISION_GROUP.PLAYER;

        if(collisionMask)
        {
            this.collisionMask = collisionMask;
        }

        this.ignoresOffscreen = false;

        this.landmassEdgeDetect = false;

        if(landmassEdgeDetect)
        {
            this.landmassEdgeDetect = true;
        }

        if(ignoreOffscreen)
        {
            this.ignoresOffscreen = ignoreOffscreen;
        }

        vec2.normalize(normDir, dirVec);

        this.dirVec = normDir;
        this.rayDist = distance;
        this.offScreen = false;
    }

    SetVec(vector, normalise)
    {
        let n = [];

        if(normalise)
        {
            p2.vec2.normalize(n, vector);
        }
        else
        {
            n = [ vector[0], vector[1] ];
        }

        this.dirVec = n;
    }

    RelativeDirection()
    {
        let outVec = [0, 0];

        this.corePhys.vectorToWorldFrame(outVec, this.dirVec);

        return outVec;
    }

    SetIgnoresOffscreen(onOff)
    {
        this.ignoresOffscreen = onOff;
        //consoleLog(`SET IGNORE OFF SCREEN: ${this.ignoresOffscreen}`);
    }

    StandardRayHit()
    {
        return (this.rayResult && this.rayResult.fraction > 0); 
    }

    EdgeRayHit()
    {
        let edgeRayHit = false;

        if(this.edgeInResult && this.edgeOutResult)
        {

            edgeRayHit = this.edgeInResult.fraction > 0 && this.edgeOutResult.fraction < 0;
        }

        return edgeRayHit;
    }

    IsHit()
    {
        return (this.StandardRayHit() || this.EdgeRayHit()) || (this.ignoresOffscreen === false && this.offScreen);
    }

    CalculateCast()
    {
        let relativeDir = this.RelativeDirection();

        this.rayTarget =  [ this.corePhys.position[0] + (relativeDir[0] * this.rayDist), this.corePhys.position[1] + (relativeDir[1] * this.rayDist) ];
        this.ray = new Ray({ mode: Ray.CLOSEST, from: this.corePhys.position, to: this.rayTarget, collisionMask: this.collisionMask, skipBackfaces: true });
        
        if(this.landmassEdgeDetect)
        {
            this.in = new Ray({ 
                mode: Ray.CLOSEST, 
                from: this.rayTarget, 
                to: this.corePhys.position,
                collisionMask: COLLISION_GROUP.PLAYER, 
                skipBackfaces: true,
            });

            this.out = new Ray({
                mode: Ray.CLOSEST,
                from: this.corePhys.position,
                to: this.rayTarget,
                collisionMask: COLLISION_GROUP.PLAYER,
                skipBackfaces: true
            })

            let edgeIn = new RaycastResult();
            let edgeOut = new RaycastResult();
            EM.phys.raycast(edgeOut, this.out);
            EM.phys.raycast(edgeIn, this.in);

            this.edgeOutResult = edgeOut;
            this.edgeInResult = edgeIn;
        }

        let result = new RaycastResult();

        EM.phys.raycast(result, this.ray);

        this.rayResult = result;
        
        if(!this.ignoresOffscreen)
        {
            //consoleLog(this.rayTarget);

            let offLeft = this.rayTarget[0] < 0;
            let offRight = this.rayTarget[0] > (PIXEL_SCALE * TILE_WIDTH);
            let offTop = (-this.rayTarget[1]) < 0;
            let offBottom = (-this.rayTarget[1]) > (PIXEL_SCALE * TILE_HEIGHT);

            //consoleLog(`offLeft: ${offLeft}, offRight: ${offRight}, offTop: ${offTop}, offBottom: ${offBottom}`);

            this.offScreen = offLeft || offRight || offTop || offBottom;
        }
    }

    DrawRayResult()
    {
        if(this.rayTarget)
        {
            paper(this.IsHit() > 0 ? 9 : 10);
            rectf(this.rayTarget[0] -1 , -(this.rayTarget[1] + 1), 2, 2);
        }
    }
}