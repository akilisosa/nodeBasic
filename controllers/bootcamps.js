const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
//@desc   get all bootcamps
// @route get api/v1/bootcamps
// @access public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {

        const bootcamps = await Bootcamp.find();

        res.status(200).json({success: true, count:bootcamps.length, data: bootcamps});
    
})


//@desc   get one bootcamps
// @route get api/v1/bootcamps/:id
// @access public 
// TODO wrap this in async handler, this is the basic way to do it
exports.getBootcamp = async (req, res, next) => {

    try{
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return next(new ErrorResponse(`bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({success:true, data:bootcamp})
    } catch (err){
       // res.status(400).json({sucess:false})
       next(err)
    }
   
}


//@desc   create bootcamps
// @route post api/v1/bootcamps/:id
// @access public 

exports.createBootcamp = asyncHandler(async (req, res, next) => {

    
   const bootcamp =  await Bootcamp.create(req.body)

    res.status(201).json({
        success:true,
        data:bootcamp
    })

})



//@desc   create bootcamps
// @route post api/v1/bootcamps/:id
// @access public 
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators: true
    });

    if(!bootcamp){
        return next(new ErrorResponse(`bootcamp not found with id of ${req.params.id}`, 404));
    }


    res.status(200).json({ success:true, data:bootcamp})

})


//@desc   delete bootcamps
// @route post api/v1/bootcamps/:id
// @access public 
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
   

        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);          
          
    
        if(!bootcamp){
            return next(new ErrorResponse(`bootcamp not found with id of ${req.params.id}`, 404));
        }
    
    
        res.status(200).json({ success:true, data:{} })
})


//@desc   get bootcamps within a radius
// @route get api/v1/bootcamps/:id
// @access public 
