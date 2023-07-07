import MDBReader from "mdb-reader";
import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import {IncomingForm} from "formidable";
import userObj from '../../data/karyawan.json';
import { prisma } from "../../src/models/db"; 


export const config = {
    api: {
      bodyParser: false
    }
  };

const dataFilePath = path.join(process.cwd(), 'data/karyawan.json');
const dataDir = path.join(process.cwd(), "data");

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
        if (req.method === "POST"){
            await syncTrans(req, res);
            // await uploadServer(req, res);
        } else if (req.method === "PUT") {
            await getData(req.body);
        } else if (req.method === "GET"){
            const path = await getPath();
            return res.status(200).json({path: path})
        }
        await prisma.$disconnect()
        return res.status(200).json({'message': 'Data has been syncronized'});
    } catch (e) {
        await prisma.$disconnect()
        return res.status(404).json({'message': e.message});
    }
    
}

const syncTrans = async () => {
  const result = await prisma.transaction.findMany({
    where: {
      OR:[
        {username: null},
        {userid: null},
        {username: ''},
        {userid: ''},
      ]
    }
  })

  await Promise.all(result.map(async (x) => {
    const res = userObj.find((usr) => usr.rfid === x.rfid);
    if (!!res){
      await prisma.transaction.update({
        where:{
          id: x.id
        },
        data: {
          userid: res.id,
          username: res.name
        }
      })
    }
  }))
  
  return result
}

const getData = async (req) => {
    const mdbDirectory = path.join(process.cwd(), "data");
    const buffer = fs.readFileSync(mdbDirectory+"/karyawan.mdb");
    const reader = new MDBReader(buffer);
    reader.getTableNames(); // ['User Info']
    const table = reader.getTable("USERINFO");
    table.getColumnNames(); // ['Badgenumber', 'CardNo', 'Name']
    const data = table.getData().map((x) => { 
      return {'id': x.Badgenumber, 'name': x.Name, 'rfid': x.CardNo}
    });
    var newData = [...data, ...userObj];
    let set = new Set();
    let unionArray = newData.filter(item => {
      if (!set.has(item.rfid)) {
        set.add(item.rfid);
        return true;
      }
      return false;
    }, set);
    const dtJson = JSON.stringify(unionArray);
    // Write the updated data to the JSON file
    await fsPromises.writeFile(dataFilePath, dtJson);
    return data;
}

const saveFile = async (file) => {
    var oldpath = files.filetoupload.filepath;
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`${dataDir}/${file.name}`, data);
    await fs.unlinkSync(file.path);
    return;
  };

const uploadServer = async (req, res) => {
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.maxFileSize = 5000 * 1024 * 1024        
        form.parse(req, function (err, fields, files) {
            var oldpath = files.file.filepath;
            const data = fs.readFileSync(oldpath);
            var newpath = 'D:/Work/NextJsProject/app-mmp/data/' + files.file.originalFilename;
            fs.writeFileSync(newpath, data);
            fs.unlinkSync(oldpath);
            return
          });
      })   
      // read file from the temporary path
      const contents = await fs.readFile(data?.files?.nameOfTheInput.path, {
        encoding: 'utf8',
      })
  };


  const getPath = () => {
    
    const pathStr = path.join(process.cwd(), 'data/karyawan.mdb');
    if (fs.existsSync(pathStr)){
        return pathStr;
      }
    return "";
  }
