const { default: mongoose } = require('mongoose');
const mongodb = require('mongoose')

const UserSchema = mongodb.Schema({
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'User'],
      default: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active', 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
},
{
    timestamps: true, 
}
)
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.methods.toJSON= function(){
    const user = this.toObject();
    delete user.password;
    return user;
}


module.exports = mongodb.model('user_detail',UserSchema)