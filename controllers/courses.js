const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc   get all bootcamps
// @route get api/v1/courses
// @route get api/v1/bootcamps/:bootcampId/courses
// @access public 

exports.getCourses = asyncHandler( async (req,res,next)=>{
    let query;

    if(req.param.bootcampID){
        query = Course.find({bootcamp:req.params.bootcampId})
    } else {
        query = Course.find();
    }

    const courses = await query;

    res.status(200).json({
        success:true,
        count: courses.length,
        data: courses
    })
})