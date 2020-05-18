const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');
//@desc   get all bootcamps
// @route get api/v1/bootcamps
// @access public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
let query;

//copy req.query
const reqQuery = { ...req.query }

//fields to exclude
const removeFields = ['select', 'sort', 'page', 'limit'];

//loop over removeFields and delete them from reqQuery
removeFields.forEach(param => delete reqQuery[param])


//create query string
let queryStr = JSON.stringify(reqQuery);

//create operators $gte 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

//finding resource
    query = Bootcamp.find(JSON.parse(queryStr));


    //select fields TODO queryStr
    if( req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    // sort
    if (req.query.sort){
        console.log('its doing the sort', console.log(req.query.sort))
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();


    query = query.skip(startIndex).limit(limit);

//executing query
        const bootcamps = await query;
//pagination result
const pagination = {};
        if(endIndex < total) {
            pagination.next = {
                page: page+1,
                limit
            }
        }

        if(startIndex>0){
            pagination.prev = {
                page: page -1,
                limit
            }
        }

        res.status(200).json({success: true, count:bootcamps.length, pagination, data: bootcamps});
    
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
// @route get api/v1/bootcamps/radius/:zipcode/:distance
// @access private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
   
const { zipcode, distance } = req.params;

// get lat/lng from geocoder
const loc = await geocoder.geocode(zipcode);
const lat = loc[0].latitude;
const lng = loc[0].longitude;


//calc radisu using radiusn
//divide dist by radius of earth
//earth radiuss = 3963 mi / 6378k

const radius = distance /3963;

const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [ [lng, lat], radius] }}
})

res.status(200).json({
    success:true, 
    count: bootcamps.length,
    data: bootcamps
})

})