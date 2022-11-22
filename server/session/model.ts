import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Session
 */

export type Session = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  sessionType: string;
  sourceLink: string; // News session property
  emoji: string; // Fibe session property
};

export type PopulatedSession = {
  _id: Types.ObjectId;
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  sessionType: string;
  sourceLink: string; // News session property
  emoji: string; // Fibe session property
};

const SessionSchema = new Schema<Session>({
  // The author userId
  authorId: {
    type: Schema.Types.ObjectId, // Use Types.ObjectId outside of the schema
    required: true,
    ref: 'User'
  },
  // The date the session was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the session
  content: {
    type: String,
    required: true
  },
  // The date the session was modified
  dateModified: {
    type: Date,
    required: true
  },
  // The type of the session
  sessionType: {
    type: String,
    required: true
  },
  // News session property
  sourceLink: {
    type: String,
    required: false // Required for all, but default value is empty string for Fibe session
  },
  // Fibe session property
  emoji: {
    type: String,
    required: false // Required for all, but default value is empty string for Fibe session
  }
});

const SessionModel = model<Session>('Session', SessionSchema);
export default SessionModel;
