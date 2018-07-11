"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
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
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password"))
            return next();
        try {
            const hash = yield bcrypt.hash(user.password, 12);
            user.password = hash;
            next();
        }
        catch (e) {
            next(e);
        }
    });
});
UserSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const result = yield bcrypt.compare(password, user.password);
        return result;
    });
};
exports.User = mongoose_1.model("User", UserSchema);
