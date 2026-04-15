import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one purchase per user per course
PurchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
