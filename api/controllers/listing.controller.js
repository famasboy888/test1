import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const data = req.body;

    const listing = await Listing.create(data);

    if (!listing) {
      return next(errorHandler(400, "Listing not created"));
    }

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
