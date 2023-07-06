import { prisma } from "../../src/models/db"; 
import bcrypt from "bcrypt";
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';



// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
        let result;
        
        if (req.method === "POST" && !req.body.login){
            result = await createUser(req.body);
        } else if (req.method === "POST" && req.body.login){
            result = await login(req.body.username, req.body.password);
            if (!result){
                return res.status(500).json({'message': 'User Not Found'});
            } else{
                setCookie('user', result, {req, res});
            }
        } else if(req.method === "GET" && req.query.browse){
            result = await getUser()
        } else if (req.method === "GET" && req.query.delete){
            result = await delUser(req.query.id);
        } else if (req.method === "PUT") {
            result = await write(req.body.id, req.body)
        }
        await prisma.$disconnect()
        return res.status(200).json(result);


    } catch (e) {
        console.log(e.message)
        await prisma.$disconnect()
        return res.status(500).json({'message': e.message})
    }   
}


const createUser = async (value) => {
    const newpass = await bcrypt.hashSync(value.password,5)  
    const newVal = {...value, password: newpass}
    const result = prisma.user.create({
        data: newVal
    });
    return result
}

const getUser =async () => {
    const result = await prisma.user.findMany({
        orderBy: [{createdat: 'desc'}],
        include:{
            categories:{
                include: {
                    category: true,
                }
            },
            items: true
            
        }
    })
    return result
}

const delUser = async (id) => {
    await prisma.user.update({
        data: {
            categories: {
                deleteMany:{}
            }
        }   ,
        where: {id: Number(id)} 
    })
    const result = await prisma.user.delete({
        where:{
            id: Number(id)
        }
    })
    return result;
}


const write = async (id, values) => {
    delete values['id']; 
    delete values['createdat']
    delete values['password']
    delete values['item_id'];
    const result = await prisma.user.update({
        where: { id: Number(id)},
        data: values
    })
    return result
}


const login = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        include: {
            categories: true,
            items: true
        }
    })

    const result = await bcrypt.compareSync(password, user.password);
    if (result){
        delete user['id']; 
        delete user['password'];
        return user
    } else {
        return undefined
    }
}