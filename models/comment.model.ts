import mongoose, { Schema, models, Document, Types } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  product: Types.ObjectId;
  parentComment?: Types.ObjectId;
  replies: Types.ObjectId[];

  createdAt: Date;
}

const commentSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    isReply: {
      type: Boolean,
      default: false,
    },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

commentSchema.index({ ticket: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

export const Comment =
  models?.Comment || mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
