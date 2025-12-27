import mongoose, { Schema, models, model, Document } from "mongoose";
// export interface IQuestion extends Document {
//     title: string;
//     content: string;
//     tags: Schema.Types.ObjectId[];
//     views: number;
//     upvotes: Schema.Types.ObjectId[];
//     downvotes: Schema.Types.ObjectId[];
//     author: Schema.Types.ObjectId;
//     answers: Schema.Types.ObjectId[];
//     createdAt: Date;
//     customField: any;
//     customArrayField: any[];
//     customNumberField: number;
//     customBooleanField: boolean;
//     customObjectField: { key: string, value: any };
// }

const AccountSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String },
    provider: { type: String },
    providerAccountId: { type: String },
    refresh_token: { type: String },
    access_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    id_token: { type: String },
    session_state: { type: String },
  },
  { timestamps: true },
);

const Account = models?.Account || model("Account", AccountSchema);

export default Account;
