import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Drawing
 */

export type Drawing = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  dateCreated: Date;
  photo: string;
  dateModified: Date;
  caption: string;
  focusReflection: string; // News drawing property
  progressReflection: string; // Fibe drawing property
};

export type PopulatedDrawing = {
  _id: Types.ObjectId;
  authorId: User;
  dateCreated: Date;
  photo: string;
  dateModified: Date;
  caption: string;
  focusReflection: string; // News drawing property
  progressReflection: string; // Fibe drawing property
};

const DrawingSchema = new Schema<Drawing>({
  // The author userId
  authorId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  // The date the drawing was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The photo of the drawing
  photo: {
    type: String,
    required: true
  },
  // The date the drawing was modified
  dateModified: {
    type: Date,
    required: true
  },
  // The type of the drawing
  caption: {
    type: String,
    required: true
  },
  // News drawing property
  focusReflection: {
    type: String,
    required: false // Required for all, but default value is empty string for Fibe drawing
  },
  // Fibe drawing property
  progressReflection: {
    type: String,
    required: false // Required for all, but default value is empty string for Fibe drawing
  }
});

const DrawingModel = model<Drawing>('Drawing', DrawingSchema);
export default DrawingModel;
