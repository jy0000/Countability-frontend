import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Drawing
 */

export type Drawing = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  dateCreated: Date;
  pixels: number[];
  dateModified: Date;
  width: number;
  height: number;
};

export type PopulatedDrawing = {
  _id: Types.ObjectId;
  authorId: User;
  dateCreated: Date;
  pixels: number[];
  dateModified: Date;
  width: number;
  height: number;
};

const DrawingSchema = new Schema<Drawing>({
  // The author userId
  authorId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  dateCreated: {
    type: Date,
    required: true
  },
  pixels: {
    type: [Number],
    required: true
  },
  dateModified: {
    type: Date,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: false
  }
});

const DrawingModel = model<Drawing>('Drawing', DrawingSchema);
export default DrawingModel;
