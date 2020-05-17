const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'length cannot be more than 50 characters']
    },
    slug: String,
    description:{
        type:String, 
        required: [true, 'please add a name'],
        trim: true,
        maxlength: [500, 'length cannot be more than 500 characters']
    },
    website:{
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'please use a valid url with https']
    },
    phone:{
        type:String,
        maxlength:[20, 'phone number can not be longer than 20']
    },
    email:{
        type:String,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please add a valid email']
    },
    address:{
        type: String,
        required: [true, 'please add an address']
    },
    location: {
        type: {
            type:String,
            enum: ['Point'],
        },
        coordinates:{
            type:[Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String, 
        zipCode: String, 
        country: String
    },
    careers: {
        //array of strings
        type:[String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'rating must be at least 1'],
        max: [10, 'rating can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default:'no-photo.jpg'
    },
    housing:{
        type:Boolean,
        default:false
    },
    jobAssistance:{
        type: Boolean,
        default:false
    },
    jobGuarantee:{
        type: Boolean,
        default: false
    },
    acceptGi:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// Create bootstamp slug from the name
BootcampSchema.pre('save', function(next){
    console.log('Slugify ran', this.name);
    this.slug = slugify(this.name, { lower:true })
    next()
})


// Geocode & create location filed
BootcampSchema.pre('save', async function(next){
    console.log('geocode ran')
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipCode: loc[0].zipcode,
        country: loc[0].country


    }
    next();
})


module.exports = mongoose.model('Bootcamp', BootcampSchema)