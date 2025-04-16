import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import {
  CACHE_TIMES,
  getCache,
  invalidateCache,
  keyBuilder,
  setCache,
} from "../utils/redis.util.js";

export const createListing = async (req, res, next) => {
  try {
    const data = req.body;

    const listing = await Listing.create(data);

    if (!listing) {
      return next(errorHandler(400, "Listing not created"));
    }

    await invalidateCache(keyBuilder.users.listingsInvalidate());

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const timerLabel = `GetListing::${JSON.stringify(req.query)}`;
    console.time(timerLabel);

    const queryParams = {
      limit: parseInt(req.query.limit) || 9,
      startIndex: parseInt(req.query.startIndex) || 0,
      offer: req.query.offer,
      furnished: req.query.furnished,
      parking: req.query.parking,
      listingType: req.query.listingType,
      searchTerm: req.query.searchTerm || "",
      sort: req.query.sort || "createdAt",
      order: req.query.order || "desc",
    };

    const cachedKey = keyBuilder.listings.search(queryParams);

    const cachedData = await getCache(cachedKey);

    if (cachedData) {
      console.log(`GetListing::Cache HIT for ${timerLabel}`);
      console.timeEnd(timerLabel);
      return res.status(200).json(cachedData);
    }

    console.log(`GetListing::Cache MISS for ${timerLabel}`);

    let {
      limit,
      startIndex,
      offer,
      furnished,
      parking,
      listingType,
      searchTerm,
      sort,
      order,
    } = queryParams;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    if (listingType === undefined || listingType === "all") {
      listingType = { $in: ["sale", "rent"] };
    }

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      listingType,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)
      .exec();

    await setCache(cachedKey, listings, CACHE_TIMES.SEARCH);

    console.timeEnd(timerLabel);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
