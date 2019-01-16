var Sequelize = require('sequelize');
var db = require('../databse');

var Events = db.define('events', {
    name: {
        type: Sequelize.STRING,
        allowNull = false
    },
    // category: {
    //     type: Sequelize.STRING
    // },
    // subcategory:{
    //     type: Sequelize.STRING
    // },
    details: {
        type: Sequelize.STRING
    },
    // ageGroup:{
    //     type: Sequelize.STRING
    // },
   startingDate:{
       type: Sequelize.DATE
   },
   expiryDate:{
       type: Sequelize.DATE
   },
    sessionStartTime: {
        type: Sequelize.TIME
    },
    sessionEndTime: {
        type: Sequelize.TIME
    },
    daysPerWeek: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING
    },
    termsAndConditions: {
        type: Sequelize.STRING
    },
    approved: {
        type: Sequelize.BOOLEAN
    },
    special:{
        type: Sequelize.BOOLEAN
    }
});


module.exports = Events;




    // name: String,
    // category: String,
    // subcategory: String,
    // details: String,
    // ageGroup: { ageGroupTitle: String, ageFrom: Number, ageTo: Number },
    // created: { type: Date, default: Date.now() },
    // makerId: { type: mongoose.Schema.Types.ObjectId, ref: 'usersDB' },
    // startingDate: Date,
    // expiryDate: Date,
    // sessionStartTime: Date,
    // sessionEndTime: Date,
    // daysPerWeek: [],
    // eventDays: [],
    programDailyDetails: {},
    // price: Number,
    // termsAndConditions: String,
    images: {
        img750x450: {
            type: String,
            default: "http://placehold.it/750x450",
        },
        img1200x300: {
            type: String,
            default: "http://placehold.it/1200x300"
        }
    },
    // approved: Boolean,
    // special: Boolean,
    address: String,
    coordinates: [Number],
    registeredMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'usersDB' }],
    originalEventId: String,
    frozeMembers: [
        {
            _id: false,
            userId: String,
            eventId: String,
            userFullName: String,
            days: [],
            compensated: { type: Boolean, default: false }
        }
    ],
    discountedMembers: [],
    expenses: [
        {
            _id: false,
            expenseDate: Date,
            expenseType: String,
            expenseDetails: String,
            expenseAmount: Number
        }
    ]
