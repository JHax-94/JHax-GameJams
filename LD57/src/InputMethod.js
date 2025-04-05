import { INPUT_TYPE } from "./InputType";
import { EM, consoleLog } from "./main";

export default class InputMethod
{  
    constructor(inputKey, type, src, axis)
    {
        this.key = inputKey;
        this.type = type;
        this.src = {};        
        this.axis = {
            x: 0,
            y: 0
        };

        if(src)
        {
            this.src = src;
        }

        if(axis)
        {
            this.axis = axis;
        }

        this.listeners = [];
    }

    UpdateState(mapSource, actionList, padMap)
    {
        if(padMap)
        {
            for(let action in padMap)
            {
                let map = padMap[action];

                this.src[action] = {
                    state: mapSource.btn[map],
                    d: mapSource.btnp[map],
                    r: mapSource.btnr[map]
                };
            }

            this.axis.x = mapSource.x;
            this.axis.y = mapSource.y;
        }
        else 
        {
            this.src = mapSource;
            
            for(let a in this.axis)
            {
                let up = `${a}+`;
                let down = `${a}-`;


                if(this.src[up] && this.src[up].state)
                {
                    this.axis[a] = 1;
                }
                else if(this.src[down] && this.src[down].state)
                {
                    this.axis[a] = -1;
                }
                else 
                {
                    this.axis[a] = 0;
                }
            }
        }

        //EM.hudLog.push(`Listeners: ${this.listeners.length}`);
        /*
        for(let i = 0; i < this.listeners.length; i ++)
        {
            let l = this.listeners[i];
            EM.hudLog.push(`Listener: ${l.state} - down: ${l.waitForDown} - up: ${l.waitForUp}`);
        }*/
    }

    CheckForButtonPress(actionArg, listener, listenerState)
    {
        if(!(actionArg instanceof Array))
        {
            actionArg = [ actionArg ];
            
        }

        let pressComplete = false;

        for(let i = 0; i < actionArg.length; i ++)
        {
            let action = actionArg[i];

            let listenState = this.GetListenerState(action, listener, listenerState);
            if(!listenState)
            {
                listenState = this.NewListenerState(action, listener, listenerState);
            }
            else
            {
                if(!listenState.waitForDown && !this.GetAction(action).state)
                {
                    listenState.waitForDown = true;
                }
                else if(listenState.waitForDown)
                {
                    if(listenState.waitForUp && !this.GetAction(action).state)
                    {
                        listenState.waitForUp = false;
                        pressComplete = true;
                    }
    
                    listenState.waitForUp = this.GetAction(action).state;
                }
            }
        }

        return pressComplete;
    }

    NewListenerState(action, listener, state)
    {   
        let listState = {
            action: action,
            listener: listener,
            state: state,
            waitForUp: false,
            waitForDown: false
        };

        this.listeners.push(listState);

        return listState;
    }

    GetListenerState(action, listener, state)
    {
        let listenerState = null;

        for(let i = 0; i < this.listeners.length; i ++)
        {
            let l = this.listeners[i];

            if(l.listener === listener && l.action === action && (l.state === state || !l.state)) 
            {
                listenerState = l;
            }
        }

        return listenerState;
    }

    GetHudLogString()
    {
        let str = "";

        str += `(${this.axis.x}, ${this.axis.y}) | `;

        for(let key in this.src)
        {
            if(this.src[key])
            {
                str += `${key}: ${this.src[key].state ? 1 : 0}; `;
            }
        }

        return str;
    }

    GetAction(action)
    {
        let state = {
            state: false,
            d: false,
            r: false
        };

        if(this.src[action])
        {
            state.state = this.src[action].state;
            state.d = this.src[action].d;
            state.r = this.src[action].r;
        }

        return state;
    }

    ClearListeners(listener)
    {
        for(let i = 0; i < this.listeners.length; i ++)
        {
            let l = this.listeners[i];

            if(l.listener === listener)
            {
                this.listeners.splice(i, 1);
                i --;
            }
        }
    }

    GetAxis(axis, deadZone)
    {
        if(deadZone)
            return Math.abs(this.axis[axis]) >= deadZone ? this.axis[axis] : 0;
        else
            return this.axis[axis];
    }   

    AnyButton()
    {
        let any = false;

        for(let key in this.src)
        {
            if(this.src[key] && this.src[key].d)
            {
                any = true;
                break;
            }
        }
        
        return any;
    }
}