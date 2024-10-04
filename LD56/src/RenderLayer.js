import { Box, Convex, Shape } from "p2";
import { consoleLog, EM, PIXEL_SCALE, setFont } from  "./main"

export default class RenderLayer
{
    constructor(name, order, ySort)
    {
        this.name = name;
        this.order = order;
        this.ySort = ySort ? true : false;
        this.renders = [];

        this.colliderColours = [ 10, 15, 17 ];
    }

    YSort()
    {
        this.renders.sort((a, b) => 
        {
            if(!a.y)
            {
                a.y = 0;
            }

            if(!b.y)
            {
                b.y = 0;
            }

            return a.y - b.y;
        });
    }




    AddRender(render, pos)
    {
        if(pos || pos === 0)
        {
            this.renders.splice(pos, 0, render);
        }
        else
        {
            this.renders.push(render);
        }
        
        if(this.ySort)
        {
            this.YSort();
        }
    }

    RemoveRender(renderer, log)
    {
        for(let i = 0; i < this.renders.length; i ++)
        {
            if(this.renders[i] === renderer)
            {
                this.renders.splice(i, 1);
                if(log) 
                {
                    consoleLog("Renderer removed!");
                    consoleLog(renderer);
                }
                break;            
            }
        }
    }

    Render()
    {
        if(this.ySort)
        {
            this.YSort();
        }

        for(let i = 0; i < this.renders.length; i ++)
        {
            if(!this.renders[i].hide)
            {
                this.renders[i].Draw();
            }

            if(EM.drawColliders && this.renders[i].phys)
            {
                this.DrawColliders(this.renders[i].phys);
            }
        }
    }

    DrawColliders(phys)
    {
        for(let i = 0; i < phys.shapes.length; i ++)
        {
            let colour = this.colliderColours[i % this.colliderColours.length];

            let log = false;

            if(phys.obj.hideCollider)
            {
                continue;
            }            

            if(phys.obj.colliderLog)
            {
                log = true;
                //consoleLog(phys.obj.colliderLog);
            }

            let shape = phys.shapes[i];

            let shapePos = [0, 0];

            phys.vectorToWorldFrame(shapePos, shape.position);

            //consoleLog(`Shape type: ${shape.type} [Box = ${Shape.BOX}, Convex = ${Shape.CONVEX}]`);

            if(false)
            {
                let box = { 
                    x: (phys.position[0] + shapePos[0]-(0.5*shape.width)), 
                    y: -(phys.position[1] + shapePos[1] + (0.5*shape.height)), 
                    width: shape.width, 
                    height: shape.height 
                };
                
                pen(colour);
                rect(box.x, box.y, box.width, box.height);
            }
            else if(true)
            {
                for(let j = 0; j < shape.vertices.length; j ++)
                {
                    let v = shape.vertices[j];

                    let vertPos = {
                        x: (phys.position[0] + shapePos[0] + v[0]),
                        y: (phys.position[1] + shapePos[1] + v[1]),
                    }

                    let nv = shape.vertices[(j+1)%shape.vertices.length];

                    let nextVertPos = {
                        x: (phys.position[0] + shapePos[0] + nv[0]),
                        y: (phys.position[1] + shapePos[1] + nv[1])
                    };

                    pen(colour);
                    paper(colour);

                    let vertRect = {
                        x: vertPos.x /** PIXEL_SCALE*/ - 2,
                        y: -vertPos.y /** PIXEL_SCALE*/ - 2,
                        w: 4,
                        h: 4
                    };

                    let edgeRect = {
                        x: vertPos.x - 1,
                        y: -vertPos.y  -1,
                        w: 1 + (nextVertPos.x-vertPos.x),
                        h: 1 + (vertPos.y-nextVertPos.y)
                    };

                    /*
                    if(j === 23 || j === 22)
                    {
                        consoleLog(`Vert ${j}`);
                        consoleLog("POS:");
                        consoleLog(vertPos);
                        consoleLog("NEXT POS:");
                        consoleLog(nextVertPos);


                        consoleLog("VERT RECT:");
                        consoleLog(vertRect);
                        consoleLog("EDGE RECT");
                        consoleLog(edgeRect);
                    }*/

                    if(edgeRect.h < 0)
                    {
                        edgeRect.h = Math.abs(edgeRect.h);
                        edgeRect.y -= edgeRect.h;
                    }

                    if(edgeRect.w < 0)
                    {
                        edgeRect.x += edgeRect.w;
                        edgeRect.w = Math.abs(edgeRect.w);
                    }

                    /*
                    consoleLog("DRAW VERT");
                    consoleLog(vertRect);
                    consoleLog("EDGE RECT");
                    consoleLog(edgeRect);**/

                    rectf(vertRect.x, vertRect.y, vertRect.w, vertRect.h);

                    /*setFont(null);
                    pen(1);
                    print(`${j}`, vertRect.x, vertRect.y + 0.5 * PIXEL_SCALE);*/


                    pen(colour);
                    rect(edgeRect.x, edgeRect.y, edgeRect.w, edgeRect.h);

                    // CENTRE POINT
                    paper(23);
                    rectf(phys.position[0]-1, -phys.position[1]-1, 2, 2);
                }
            }
            else
            {
                consoleLog("UNKNOWN COLLIDER SHAPE!");
                consoleLog(shape);
            }
        }
    }
}