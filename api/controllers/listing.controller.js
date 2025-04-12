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

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit?.trim()) ?? 10;
    const startIndex = parseInt(req.query.startIndex?.trim()) ?? 0;
    const offer = req.query.offer === true;
    const furnished = req.query.furnished === true;
    const parking = req.query.parking === true;
    const listingType = req.query.type?.trim() ?? "all";
    const searchTerm = req.query.searchTerm?.trim() ?? "";
    const sortBy = req.query.sortBy?.trim() ?? "createdAt";
    const sortOrder = req.query.sortOrder?.trim() ?? "desc";
    let offerQuery = {};
    let furnishedQuery = {};
    let parkingQuery = {};
    let listingTypeQuery = {};

    if (!offer) {
      offerQuery = {
        $in: [false, true],
      };
    }

    if (!furnished) {
      furnishedQuery = {
        $in: [false, true],
      };
    }
    if (!parking) {
      parkingQuery = {
        $in: [false, true],
      };
    }

    if (listingType === undefined || listingType === "all") {
      listingTypeQuery = {
        $in: ["rent", "sale"],
      };
    }

    const listings = await Listing.find({
      name: {
        $regex: searchTerm,
        $options: "i",
      },
      offer: offerQuery,
      furnished: furnishedQuery,
      parking: parkingQuery,
      listingType: listingTypeQuery,
      listingStatus: {
        $ne: "deleted",
      },
    })
      .sort({
        [sortBy]: sortOrder,
      })
      .limit(limit)
      .skip(startIndex)
      .exec();

    if (!listings) {
      return next(errorHandler(400, "Listings not found"));
    }

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
