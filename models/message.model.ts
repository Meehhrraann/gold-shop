import mongoose, { Schema, models, Document, Types } from "mongoose";

export interface IMedia {
  url: string;
  type: "image" | "video" | "audio" | "file";
  filename: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
  duration?: number;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  content: string;
  sender: Types.ObjectId;
  chat: Types.ObjectId;
  readBy: Types.ObjectId[];
  media: IMedia[];
  replyTo?: Types.ObjectId;
  type: "text" | "media" | "system" | "reply";
  isEdited: boolean;
  editedAt?: Date;
  likes: Types.ObjectId[]; // ✅ updated field
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema({
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ["image", "video", "audio", "file"],
    required: true,
  },
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  thumbnail: { type: String },
  duration: { type: Number },
});

const messageSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    content: { type: String },
    senderName: { type: String },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    media: [mediaSchema],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    type: {
      type: String,
      enum: ["text", "media", "system", "reply"],
      default: "text",
    },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ], // ✅ updated field
  },
  { timestamps: true },
);

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

export const Message =
  models?.Message || mongoose.model<IMessage>("Message", messageSchema);
export default Message;
