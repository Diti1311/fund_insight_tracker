const express = require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const {
  getWatchlist,
  addWatchlist,
  deleteWatchlist
} = require(
  "../controllers/watchlistController"
);

router.get(
  "/",
  auth,
  getWatchlist
);

router.post(
  "/",
  auth,
  addWatchlist
);

router.delete(
  "/:schemeCode",
  auth,
  deleteWatchlist
);

module.exports = router;