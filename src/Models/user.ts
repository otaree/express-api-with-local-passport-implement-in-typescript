import { Document, Model, model, Schema } from "mongoose";
import * as bcrypt  from 'bcrypt';

interface IUser {
    email: string,
    password: string
}

interface IUserModel extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}


const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 6,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre("save", async function (next) {
    const user = <IUserModel>this;

    if (!user.isModified("password")) return next();

    try {
        const hash = await bcrypt.hash(user.password, 12);
        user.password = hash;
        next();
    } catch (e) {
        next(e);
    }

});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const user = this;

    const result = await bcrypt.compare(password, user.password);
    
    return result;
};

export const User: Model<IUserModel> = model("User", UserSchema);



