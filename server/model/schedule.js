import mongoose from 'mongoose'

const ScheduleSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    joinedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    payedCurrentMonth: {
        type: Boolean,
        default: false,
        required: true
    },
    paidMonths: {
        type: Array,
        default: [],
    },
    previousMonthBatchs: {
        type: Array,
        default: [],
    },
    currentMonthBatch: {
        type: Number,
        required: true
    },
})

ScheduleSchema.pre('save', function (next) {
    var schedule = this
    if (schedule.isModified('payedCurrentMonth')){
        if (schedule.payedCurrentMonth) {
            schedule.paidMonths.push(Date.now())
        }
    }

    if (schedule.isModified('currentMonthBatch')) {
        schedule.previousMonthBatchs.push(schedule.currentMonthBatch)
    }

    next()
})

export default mongoose.model('Schedule', ScheduleSchema)