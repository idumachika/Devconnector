const express = require ('express');
const router = express.Router();

// @route Get api/posts/test
// @desc Test post route
// @access public
router.get('./test', ( req ,res)=> res.json({msg:"post Works"}));

module.exports=router;