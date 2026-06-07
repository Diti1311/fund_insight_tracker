const Watchlist = require("../models/Watchlist");

exports.getWatchlist = async (
  req,
  res
) => {
  const data =
    await Watchlist.find({
      userId: req.user.id
    });

  res.json(data);
};

exports.addWatchlist = async (
  req,
  res
) => {
  try {
    const {
      schemeCode,
      schemeName
    } = req.body;

    const item =
      await Watchlist.create({
        schemeCode,
        schemeName,
        userId: req.user.id
      });

    res.status(201).json(item);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message:
          "Fund already exists"
      });
    }

    res.status(500).json({
      message: err.message
    });
  }
};

exports.deleteWatchlist =
  async (req, res) => {

    const deleted =
      await Watchlist.findOneAndDelete({
        schemeCode:
          req.params.schemeCode,
        userId: req.user.id
      });

    if (!deleted) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json({
      message: "Deleted"
    });
  };