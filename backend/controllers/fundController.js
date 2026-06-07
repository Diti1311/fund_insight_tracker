const axios = require("axios");

const cache =
  require("../utils/cache");

exports.searchFunds = async (
  req,
  res
) => {
  try {
    const q = req.query.q;

    const response =
      await axios.get(
        `https://api.mfapi.in/mf/search?q=${q}`
      );

    res.json(response.data);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.getFundDetail = async (req, res) => {
  try {
    const code = req.params.schemeCode;

    const cached = cache.get(code);

    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(
      `https://api.mfapi.in/mf/${code}`
    );

    const fund = response.data;

    const cleanedData = fund.data
      .map(item => ({
        date: item.date,
        nav: Number(item.nav),
        parsedDate: new Date(
          item.date.split("-").reverse().join("-")
        )
      }))
      .sort((a, b) => a.parsedDate - b.parsedDate);

    const result = {
      meta: fund.meta,
      data: cleanedData
    };

    cache.set(code, result);

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};