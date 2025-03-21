import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  suggestion: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Suggestion", SuggestionSchema);
