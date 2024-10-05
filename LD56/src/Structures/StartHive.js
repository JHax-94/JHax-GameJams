import { EM } from "../main";
import Structure from "./Structure";

export default class StartHive extends Structure
{
    constructor(pos)
    {
        super(pos);

        this.isConnected = true;

        EM.AddEntity("START_HIVE", this);
    }
}