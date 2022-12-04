import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Point.
 */
export type Point = {
  _id: Types.ObjectId; // The id of this point
  point: number;
  username: string;
};

const PointSchema = new Schema({
  // Current user point
  point: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

const PointModel = model<Point>('Point', PointSchema);
export default PointModel;
