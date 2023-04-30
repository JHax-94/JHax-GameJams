import FollowBehaviour from "./FollowBehaviour";

export default class ChaseBehaviour extends FollowBehaviour
{
    constructor(beast, target)
    {
        let opts = { minDist: 0, followToDistance: 0, type: "CHASE" };
        super(beast, target, opts);
    }
}