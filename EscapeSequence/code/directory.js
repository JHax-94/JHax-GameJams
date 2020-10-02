class Directory extends FileSystemObj
{
    constructor(dirConf, parentDir)
    {
        super(dirConf);
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

                if(dirConf.contents[i].type==='dir')
                {
                    this.contents.push(new Directory(dirConf.contents[i], this));
                }
                else if(dirConf.contents[i].type==='file')
                {
                    this.contents.push(new FileObj(dirConf.contents[i]));
                }
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

    getProgram(programName)
    {
        console.log("Searching for prog " + programName);
        var returnProg = null;

        for(var i = 0; i < this.contents.length; i ++)
        {
            var item = this.contents[i];
            console.log("Check item:");
            console.log(item);
            if(item.type === 'file' && item.extension === 'exe')
            {
                console.log(programName);

                var matchesFull = strComp(item.name, programName);
                var matchesPartial = strComp(item.fileName, programName);
                if(matchesFull || matchesPartial)
                {
                    returnProg = item;
                }
            }
        }

        return returnProg;
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