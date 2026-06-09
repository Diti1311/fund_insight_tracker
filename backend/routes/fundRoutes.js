const express =
  require("express");

const router =
  express.Router();

const {
  searchFunds,
  getFundDetail,
} = require(
  "../controllers/fundController"
);

router.get(
  "/search",
  searchFunds
);

router.get(
  "/:schemeCode",
  getFundDetail
);

module.exports = router;