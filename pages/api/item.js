import { prisma } from "../../src/models/db";
import { getCookie } from 'cookies-next';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
        if (req.method === "POST"){
            const result = await create(req.body);
            return res.status(200).json(result);
        } else if(req.method === "GET" && req.query.browse){
            const result = await browse(req, res);
            return res.status(200).json(result);
        } else if (req.method === "GET" && req.query.search) {
            const result = await search(req, res, req.query.search);
            return res.status(200).json(result);
        } else if (req.method === "GET" && req.query.delete){
            const result = await unlink(req.query.id);
            return res.status(200).json(result);
        } else if (req.method === "PUT") {
            const result = await write(req.body.id, req.body)
            return res.status(200).json(result);
        }
    } catch (e) {
        // console.log(e.message);
        return res.status(500).json({'message': e.message})
    }   
}


const create = async (value) => {
    const result = prisma.item.create({
        data: value
    });
    return result
}

const browse =async (req, res) => {
    let usrJson = JSON.parse(getCookie('user', {req, res}));
    usrJson = usrJson.categories.map((x) => x.categoryid)
    let jsonStr = '';
    if (usrJson.length > 0){
       jsonStr = {
        where: {
            categories: {id: {in: usrJson }}
        },
        orderBy: [{createdat: 'desc'}],
        include:{
            categories: true
        }
    }
    } else {
        jsonStr = {
            orderBy: [{createdat: 'desc'}],
            include:{
                categories: true
            }
    }
    }
    const result = await prisma.item.findMany(jsonStr)
    return result
}


const search =async (req, res) => {
   
    const jsonStr = {
            where: {
                categories: {id: {in: eval(req.query.search) }}
            },
            orderBy: [{createdat: 'desc'}],
            include:{
                categories: true
            }
    }
    
    const result = await prisma.item.findMany(jsonStr)
    return result
}

const unlink = async (id) => {
    const result = await prisma.item.delete({
        where:{
            id: Number(id)
        }
    })
    return result;
}


const write = async (id, values) => {
    delete values['id'];
    delete values['createdat'];
    
    const result = await prisma.item.update({
        where: { id: Number(id)},
        data: values
    })
    return result
}