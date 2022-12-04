import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * A model representing a WorkSession
 */

export type WorkSession = {
  _id: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  sessionOwnerId: Types.ObjectId;
  numChecks: number; // Timing occurs in the frontend (client-side)
  checks: Types.ObjectId[]; // Contains ids of each productivity check
};

export type PopulatedWorkSession = {
  _id: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  sessionOwner: User;
  numChecks: number;
  checks: Types.ObjectId[];
};

const WorkSessionSchema = new Schema<WorkSession>({
  // User who started this work session
  sessionOwnerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Start time of this session
  startDate: {
    type: Date,
    required: true
  },
  // End time of this session
  endDate: {
    type: Date,
    required: false
  },
  // Total number of productivity checks user sets in this session
  numChecks: {
    type: Number,
    required: true
  },
  // All the productivity checks in this session, along with their photos
  checks: [{
    type: Schema.Types.ObjectId,
    required: true
  }]
});

const WorkSessionModel = model<WorkSession>('WorkSession', WorkSessionSchema);
export default WorkSessionModel;
