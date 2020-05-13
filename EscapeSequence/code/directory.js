class Directory
{
    constructor(dirConf, parentDir)
    {
        console.log("Constructing dir: " + dirConf.name + " | Parent:");
        console.log(parentDir)
        this.name = dirConf.name;
        this.contents = [];
        this.path = "";
        this.parent = parentDir;

        if(this.parent)
        {
            var parentPath = parentDir.path;
            
            if(!parentPath.endsWith("\\"))
            {
                parentPath += "\\";
            }

            this.path += parentPath;
        }

        this.path += this.name;
        
        if(dirConf.contents)
        {
            for(var i = 0; i < dirConf.contents.length; i ++)
            {
                console.log("Recurse!");
                console.log(this);
                this.contents.push(new Directory(dirConf.contents[i], this));
            }
        }
    }

    listContents()
    {
        for(var i = 0; i < this.contents.length; i ++)
        {
            cmd.addLine(this.contents[i].name);
        }
    }

    changeDirectory(pathArr, errorStr)
    {
        console.log("Changing dir...");
        console.log(pathArr);

        var nextDir = null;

        if(pathArr[0] === "..")
        {
            nextDir = this.parent;
        }
        else
        {
            for(var i = 0; i < this.contents.length && nextDir === null; i ++)
            {
                if(strComp(this.contents[i].name, pathArr[0]))
                {
                    nextDir = this.contents[i];
                }
            }
        }
                
        if(nextDir === null)
        {
            errorStr = 'System cannot find the file specified.';
        }
        else if(pathArr.length > 1)
        {
            pathArr.splice(0, 1);

            nextDir = nextDir.changeDirectory(pathArr, errorStr);            
        }

        return nextDir;
    }
}