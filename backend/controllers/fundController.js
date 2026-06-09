const axios =
  require("axios");

const cache =
  require("../utils/cache");

exports.searchFunds =
  async (req, res) => {
    try {
      const q =
        req.query.q;

      if (!q) {
        return res
          .status(400)
          .json({
            message:
              "Search query required",
          });
      }

      const response =
        await axios.get(
          `https://api.mfapi.in/mf/search?q=${q}`
        );

      res.json(
        response.data
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

exports.getFundDetail =
  async (req, res) => {
    try {
      const schemeCode =
        req.params
          .schemeCode;

      const cached =
        cache.get(
          schemeCode
        );

      if (cached) {
        return res.json(
          cached
        );
      }

      const response =
        await axios.get(
          `https://api.mfapi.in/mf/${schemeCode}`
        );

      cache.set(
        schemeCode,
        response.data
      );

      res.json(
        response.data
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };