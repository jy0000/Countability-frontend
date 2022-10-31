import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 */

export type Freet = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  freetType: string;
  sourceLink: string; // News post property
  emoji: string; // Fibe post property
};

export type PopulatedFreet = {
  _id: Types.ObjectId;
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  freetType: string;
  sourceLink: string; // News post property
  emoji: string; // Fibe post property
};

const FreetSchema = new Schema<Freet>({
  // The author userId
  authorId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  // The type of the freet
  freetType: {
    type: String,
    required: true
  },
  // News freet property
  sourceLink: {
    type: String,
    required: false // Required for all, but default value is empty string for Fibe post
  },
  // Fibe freet property
  emoji: {
    type: String,
    required: false // Required for all, but default value is empty string for Fibe post
  }
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
