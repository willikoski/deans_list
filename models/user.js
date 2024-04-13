const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    email: { required: true, type: String, unique: true },
    password: { type: String, required: true },
    campusNum: String,
    campus: String,
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student', 'parent'],
        default: 'admin'
    },
    subjects: [String],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    gradeLevel: String,
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    studentId: String,
    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
