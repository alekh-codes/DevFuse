const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({fromUserId:1,toUserId:1})

connectionRequestSchema.pre("save",function(){
  
  if(this.fromUserId.equals(this.toUserId)){
    throw new Error("cannot send request to yourself");
  }
})

module.exports = mongoose.model("ConnectionRequest",connectionRequestSchema);
