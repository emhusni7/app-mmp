import { prisma } from "../../src/models/db"; 


export default async (req, res) => {
    try {
        if (req.method === "POST"){
            const result = await create(req.body);
            return res.status(200).json(result);
        } else if(req.method === "GET" && req.query.browse){
            const result = await browse()
            return res.status(200).json(result);
        } else if (req.method === "GET" && req.query.delete){
            const result = await unlink(req.query.id);
            return res.status(200).json(result);
        } else if (req.method === "PUT") {
            const result = await write(req.body.id, req.body)
            return res.status(200).json(result);
        }
    } catch (e) {
        return res.status(500).json({'message': e.message})
    }   
}


const create = async (value) => {
    const result = prisma.category.create({
        data: value
    });
    return result
}

const browse =async () => {
    const result = await prisma.category.findMany({
        orderBy: [{createdat: 'desc'}]
    })
    return result
}

const unlink = async (id) => {
    const result = await prisma.category.delete({
        where:{
            id: Number(id)
        }
    })
    return result;
}


const write = async (id, values) => {
    delete values['id'];
    delete values['createdat']
    const result = await prisma.category.update({
        where: { id: Number(id)},
        data: values
    })
    return result
}