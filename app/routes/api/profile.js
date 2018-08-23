const express = require ('express');
const router = express.Router();

// @route Get api/posts/test
// @desc Test profile route
// @access public

router.get('./test', ( req ,res)=> res.json({msg:"Profile Works"}));

module.exports=router;