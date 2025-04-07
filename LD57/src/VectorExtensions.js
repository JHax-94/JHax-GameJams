import { vec2 } from "p2";

export default class VectorExtensions
{
    constructor() {}

    ExtendVec2()
    {
        vec2.angleBetween = function(a, b)
        {
            let dot = vec2.dot(a, b);
            let denom = vec2.length(a) * vec2.length(b);

            return Math.acos(dot / denom);
        }

        vec2.angleDelta = function (a, b)
        {
            let dot = vec2.dot(a, b);
            let det = (b[0]*a[1] - b[1]*a[0]);

            return Math.atan2(det, dot);
        }
    }
}