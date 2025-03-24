import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to check if coupon is expired
CouponSchema.virtual("isExpired").get(function () {
  return this.endDate < new Date();
});

CouponSchema.virtual("daysLeft").get(function () {
    const now = new Date();
    const diffInMs = this.endDate - now;
    const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
    return daysLeft > 0 ? `${daysLeft} Days left` : "Expired";
  });
  

// Pre-validation middleware for date and discount constraints
CouponSchema.pre("validate", function (next) {
  const now = new Date();

  if (this.endDate < this.startDate) {
    return next(new Error("End date cannot be earlier than start date"));
  }
  if (this.startDate < now.setHours(0, 0, 0, 0)) {
    return next(new Error("Start date cannot be in the past"));
  }
  if (this.endDate < now.setHours(0, 0, 0, 0)) {
    return next(new Error("End date cannot be in the past"));
  }
  if (this.discount <= 0 || this.discount > 100) {
    return next(new Error("Discount must be between 1 and 100"));
  }

  next();
});

// Compile schema into model
const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
