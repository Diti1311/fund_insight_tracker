const supabase =
  require("../config/supabase");

exports.getWatchlist =
  async (req, res) => {
    try {
      const { data, error } =
        await supabase
          .from("watchlist")
          .select("*")
          .eq(
            "user_id",
            req.user.id
          );

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.addWatchlist =
  async (req, res) => {
    try {
      const {
        schemeCode,
        schemeName,
      } = req.body;

      if (
        !schemeCode ||
        !schemeName
      ) {
        return res
          .status(400)
          .json({
            message:
              "schemeCode and schemeName required",
          });
      }

      const { data, error } =
        await supabase
          .from("watchlist")
          .insert([
            {
              scheme_code:
                schemeCode,
              scheme_name:
                schemeName,
              user_id:
                req.user.id,
            },
          ])
          .select();

      if (error) {
        if (
          error.message.includes(
            "duplicate"
          ) ||
          error.code ===
            "23505"
        ) {
          return res
            .status(409)
            .json({
              message:
                "Fund already exists",
            });
        }

        throw error;
      }

      res.status(201).json(
        data
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.deleteWatchlist =
  async (req, res) => {
    try {
      const schemeCode =
        req.params.schemeCode;

      const { error } =
        await supabase
          .from("watchlist")
          .delete()
          .eq(
            "scheme_code",
            schemeCode
          )
          .eq(
            "user_id",
            req.user.id
          );

      if (error)
        throw error;

      res.status(200).json({
        message: "Deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };