import mongoose, { Schema, model } from "mongoose";

interface ITransaction {
  from: mongoose.Types.ObjectId;
  fromUsername: string;
  to: mongoose.Types.ObjectId;
  toUsername: string;
  amount: number;
  currency: string;
  dateTime: Date;
}

const transactionSchema = new Schema<ITransaction>({
  from: mongoose.Types.ObjectId,
  fromUsername: String,
  to: mongoose.Types.ObjectId,
  amount: Number,
  currency: String,
  dateTime: Date,
});

const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema,
  "transactions"
);
export { Transaction, ITransaction };
