import mongoose from "mongoose";
module.exports = function (req: any, res: any, next: any) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid Id");

  next();
};
