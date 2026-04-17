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
userSchema.index({ email: 1 }, { unique: true });
UserSchema.methods.toJSON= function(){
    const user = this.Object();
    delete user.password;
    return user;
}
userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))  return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongodb.model('user_detail',UserSchema)