const mongoose = require('mongoose');
const userModel = require("../../models/userModel")

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

async function updateUser(req,res){
    try{
        const sessionUser = req.userId

        if (!isValidObjectId(sessionUser)) {
            return res.status(400).json({ message: 'User ID is invalid or missing', error: true, success: false });
        }

        if (!sessionUser) {
            return res.status(400).json({ message: 'User ID is missing', error: true, success: false });
        }

        const { userId , email, name, role} = req.body

        const payload = {
            ...( email && { email : email}),
            ...( name && { name : name}),
            ...( role && { role : role}),
        }

        const user = await userModel.findById(sessionUser)

        console.log("user.role",user.role)



        const updateUser = await userModel.findByIdAndUpdate(userId,payload)

        
        res.json({
            data : updateUser,
            message : "User Updated",
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = updateUser