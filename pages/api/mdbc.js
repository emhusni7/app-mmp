import MDBReader from "mdb-reader";
import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import {IncomingForm} from "formidable";


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
        if (req.  method === "POST"){
            await uploadServer(req, res);
            return res.status(200).json({'message': 'Data has been syncronized'});
        } else if (req.method === "PUT") {
            await getData(req.body);
            return  res.status(200).json({'message': 'Data has been syncronized'});
        } else if (req.method === "GET"){
            const path = await getPath();
            return res.status(200).json({path: path})
            
        }
    } catch (e) {
        return res.status(404).json({'message': 'Data Failed to sync'});
    }
    
}

const getData = async (req) => {
    const mdbDirectory = path.join(process.cwd(), "data");
    const buffer = fs.readFileSync(mdbDirectory+"/karyawan.mdb");
    const reader = new MDBReader(buffer);
    reader.getTableNames(); // ['User Info']
    const table = reader.getTable("USERINFO");
    table.getColumnNames(); // ['Badgenumber', 'CardNo', 'Name']
    const data = table.getData().map((x) => { return {'id': x.Badgenumber, 'name': x.Name, 'rfid': x.CardNo}});
    const dtJson = JSON.stringify(data);
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
