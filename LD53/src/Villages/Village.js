import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog } from "../main"
import VillageRequest from "./VillageRequest";
import VillageShop from "./VillageShop";

export default class Village
{
    constructor(pos)
    {
        this.renderLayer = "WORLD";

        let physSettings = {
            tileTransform: {
                x: pos.x,
                y: pos.y,
                w: 2,
                h: 2
            },
            mass: 50,
            isSensor: true,
            isKinematic: false,
            tag: "VILLAGE",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: COLLISION_GROUP.PLAYER,
            linearDrag: 0.9
        }

        EM.RegisterEntity(this, { physSettings: physSettings });

        this.villageBuildingSprites = [
            22, 23, 24
        ];

        this.players = [];

        this.requests = [];
        this.texture = this.BuildTexture()
    }

    PlayersChanged()
    {
        if(this.shop)
        {
            if(this.players.length === 0)
            {
                this.shop.Hide(true);
            }
            else 
            {
                this.shop.Hide(false);
            }
        }
    }

    GetShoppingPlayer()
    {
        let player = null;

        if(this.players.length > 0)
        {
            player = this.players[0];
        }

        return player;
    }

    TrackPlayer(player)
    {
        if(this.players.indexOf(player) < 0)
        {
            this.players.push(player);
        }
        this.PlayersChanged();
    }

    RemovePlayer(player)
    {
        let index = this.players.indexOf(player);

        if(index >= 0)
        {
            this.players.splice(index, 1);
        }

        this.PlayersChanged();
    }

    AddShop(shopConfig)
    {
        this.shop = new VillageShop(this, shopConfig);
        this.shop.Hide(true);
    }

    AddRequest(requestData)
    {
        this.requests.push(new VillageRequest(this, requestData));
    }

    OfferBeast(beast)
    {
        consoleLog("Beast offered...");
        consoleLog(beast);

        for(let i = 0; i < this.requests.length; i ++)
        {
            let request = this.requests[i];

            consoleLog("Compare beast to request:");
            consoleLog(request);

            if(request.BeastRequired(beast))
            {
                consoleLog("Beast required!");

                request.SupplyBeast(beast);

                beast.DeleteBeast();
            }
        }
    }

    BuildTexture()
    {
        let newTex = new Texture(this.width, this.height);

        let tileWidth = this.width / PIXEL_SCALE
        let tileHeight = this.height / PIXEL_SCALE;
        for(let x = 0; x < tileWidth; x ++)
        {
            for(let y = 0; y < tileHeight; y ++)
            {
                newTex.sprite(this.villageBuildingSprites[random(this.villageBuildingSprites.length)], x * PIXEL_SCALE, y * PIXEL_SCALE);
            }
        }
        
        return newTex;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        this.texture._drawEnhanced(screenPos.x, screenPos.y);
    }



}