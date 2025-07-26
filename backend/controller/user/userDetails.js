const mongoose = require('mongoose');
const userModel = require("../../models/userModel")

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

async function userDetailsController(req,res){
    try{
        if (!isValidObjectId(req.userId)) {
            return res.status(400).json({ message: 'User ID is invalid or missing', error: true, success: false });
        }
        console.log("userId",req.userId)
        const user = await userModel.findById(req.userId)

        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "User details"
        })

        console.log("user",user)

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = userDetailsController