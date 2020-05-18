const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true, 'please add a cousrse title']
    },
    description:{
        type:String,
        required: [true,'please a description']
    },
    weeks:{
        type:String,
        required: [true,'please add numbers of weeks']
    },
    tuition:{
        type:Number,
        required: [true,'please add tuition cost']
    },
    minimumSkill: {
        type: String,
        reqiuired: [true, 'please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']

    },
    scholarshipsAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);