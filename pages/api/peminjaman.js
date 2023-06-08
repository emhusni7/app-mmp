import userObj from '../../data/karyawan.json';

export default async(req, res) => {
    try {
        if (req.body.getUser && req.method === "POST"){
            const result = await getUser(req.body.rfid);
            if (!!result){
                return res.status(200).json(result);    
            } else {
                return res.status(400).json({'message': 'Not Found'});    
            }
            
        }
    }catch (e){
        res.status(404).json({'message': e.message});
    }
}

const getUser= async (value) => {
    const data = userObj.find((usr) => usr.rfid === value)
    return data
}