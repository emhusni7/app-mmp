import userObj from '../../data/karyawan.json';
import { prisma } from "../../src/models/db"; 

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    try {
        if (req.body.getUser && req.method === "POST"){
            const result = await getUser(req.body.rfid);
            // console.log(result)
            if (!!result){
                return res.status(200).json(result);            
            } else {
                res.status(404).json({'message': 'Data Not Found'});                
            }
            
        } else if (req.method === "POST" && !req.body.browse){
            const result = await create(req.body);
            return res.status(200).json(result);
        } else if(req.method === "POST" && req.body.browse){
            const result = await browse(req.body.where, req.body.skip, req.body.take, req.body.orderBy);
            return res.status(200).json(result);
        } else if (req.method === "GET" && req.query.delete){
            const result = await unlink(req.query.id);
            return res.status(200).json(result);
        } else if (req.method === "PUT") {
            const result = await write(req.body.id, req.body)
            return res.status(200).json(result);
        }
    }catch (e){
        // console.log(e.message);
        res.status(404).json({'message': e.message});
    }
}

const getUser= async (value) => {
    const data = userObj.find((usr) => usr.rfid === value)
    return data
}

const create = async (value) => {
    
    const result = prisma.transaction.create({
        data: value
    });
    return result
}

const browse =async (where , skip , take, orderBy) => {
    // console.log(where);
    const [data, count] = await prisma.$transaction([
        prisma.transaction.findMany({skip: skip, take: take, where: where, orderBy: orderBy, include:{
                items: {
                    include: {
                        categories: true
                    } 
                }
            }
        }),
        prisma.transaction.count({where})
    ])
    
    return {
        pagination: { total: count},
        data: data
    }
}

const unlink = async (id) => {
    const result = await prisma.transaction.delete({
        where:{
            id: Number(id)
        }
    })
    return result;
}


const write = async (id, values) => {
    delete values['id'];
    delete values['createdat']
    const result = await prisma.transaction.update({
        where: { id: Number(id)},
        data: values
    })
    return result
}