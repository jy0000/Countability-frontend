import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import DrawingCollection from './collection';

/**
 * Checks if a drawing has the resource needed for its drawing type
 */
const isDrawingPropertyComplete = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.focusReflection || !req.body.progressReflection) {
    res.status(412).json({
      error: 'Fibe drawing needs a focusReflection and progressReflection.' // Added this for error
    });
    return;
  }

  next();
};

/**
 * Checks if a drawing with drawingId is req.params exists
 */
const isDrawingExists = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const drawingId = req.body.drawingId === undefined ? req.params.drawingId : req.body.drawingId;
  const validFormat = Types.ObjectId.isValid(drawingId);
  console.log(drawingId);
  const drawing = validFormat ? await DrawingCollection.findOne(drawingId) : '';
  if (!drawing) {
    res.status(404).json({
      error: `Drawing with drawing ID ${req.params.drawingId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the photo of the drawing in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidDrawingContent = (req: Request, res: Response, next: NextFunction) => {
  const {photo} = req.body as {photo: string}; // Changed
  if (!photo.trim()) {
    res.status(400).json({
      error: 'Drawing photo must be at least one character long.'
    });
    return;
  }

  if (photo.length > 140) {
    res.status(413).json({
      error: 'Drawing photo must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the drawing whose drawingId is in req.params
 */
const isValidDrawingModifier = async (req: Request, res: Response, next: NextFunction) => {
  const drawing = await DrawingCollection.findOne(req.params.drawingId);
  const userId = drawing.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' drawings.'
    });
    return;
  }

  next();
};

export {
  isDrawingPropertyComplete,
  isValidDrawingContent,
  isDrawingExists,
  isValidDrawingModifier
};
