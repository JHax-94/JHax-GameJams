import { consoleLog } from "../main";
import Beast from "./Beast";
import ChaseBehaviour from "./Behaviours/ChaseBehaviour";
import FeedBehaviour from "./Behaviours/FeedBehaviour";
import FleeBehaviour from "./Behaviours/FleeBehaviour";
import FollowBehaviour from "./Behaviours/FollowBehaviour";
import GrazeBehaviour from "./Behaviours/GrazeBehaviour";
import HuntBehaviour from "./Behaviours/HuntBehaviour";
import SeekBehaviour from "./Behaviours/SeekBehaviour";

export default class VeggieBeast extends Beast
{
    constructor(startPos)
    {
        super(startPos, "VEGGIE");

        this.default = "seek";

        this.moveSpeed = {
            seek: 2500 * this.phys.mass,
            follow: 5000 * this.phys.mass,
            flee: 8000 * this.phys.mass,
            graze: 2000 * this.phys.mass,
            chase: 3000 * this.phys.mass
        };

        this.sprite = 17;
        this.texture = this.BuildTexture();

        this.fedTime = 10;
        this.fedTimer = 10;
    }

    IsHungry()
    {
        return this.fedTimer <= 0;
    }

    UpdateInternal(deltaTime)
    {

        if(this.fedTimer > 0)
        {
            this.fedTimer -= deltaTime;

            if(this.fedTimer <= 0)
            {
                this.fedTimer = 0;
                this.behaviours = [ new SeekBehaviour(this) ];
            }
        }
    }

    ReactTo(stimulus)
    {
        super.ReactTo(stimulus);

        if(stimulus.stimType === "SEEN")
        {
            if(stimulus.seenBody.obj.obstacleType === "bush")
            {
                this.behaviours = [ new ChaseBehaviour(this, stimulus.seenBody.obj) ];
            }
        }
        else if(stimulus.stimType === "COLLISION")
        {
            if(stimulus.collisionWith.obstacleType === "bush" || stimulus.collisionWith.baitType === "Berry")
            {
                this.behaviours = [ new FeedBehaviour(this, stimulus.collisionWith) ];
            }
        }
        else if(stimulus.stimType === "WHISTLE")
        {
            if(!this.IsHungry())
            {
                this.behaviours = [ new FleeBehaviour(this, stimulus.GetSource()) ];
            }
            else if(this.HasBehaviour("FOLLOW"))
            {
                this.DefaultBehaviour();
            }
        }
        else if(stimulus.stimType === "HORN")
        {
            if(this.IsHungry())
            {
                this.behaviours = [ new FollowBehaviour(this, stimulus.GetSource()) ];
            }
        }
        else if(stimulus.stimType === "SMELL")
        {
            if(stimulus.dealtBy.baitType === "Berry")
            {
                this.behaviours = [ new ChaseBehaviour(this, stimulus.dealtBy) ];
            }
        }
    }

    DefaultBehaviour(lastBehaviour)
    {
        
        if(lastBehaviour && lastBehaviour.behaviourType === "FEED")
        {
            this.fedTimer = this.fedTime;
        }

        if(this.IsHungry())
        {
            this.behaviours = [ new SeekBehaviour(this) ];
        }
        else
        {
            this.behaviours = [ new GrazeBehaviour(this) ];
        }
    }
}