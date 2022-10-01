import { consoleLog, EM } from  "./main"

export default class RenderLayer
{
    constructor(name, order, ySort)
    {
        this.name = name;
        this.order = order;
        this.ySort = ySort ? true : false;
        this.renders = [];
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


    AddRender(render)
    {
        this.renders.push(render);

        if(this.ySort)
        {
            this.YSort();
        }
        /*
        consoleLog("Render added to layer");
        consoleLog(this);*/
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
            let shape = phys.shapes[i];

            let shapePos = [0, 0];

            phys.vectorToWorldFrame(shapePos, shape.position);

            let box = { 
                x: (phys.position[0] + shapePos[0]-(0.5*shape.width)), 
                y: -(phys.position[1] + shapePos[1] + (0.5*shape.height)), 
                width: shape.width, 
                height: shape.height 
            };
            
            pen(42);
            rect(box.x, box.y, box.width, box.height);
        }
    }
}