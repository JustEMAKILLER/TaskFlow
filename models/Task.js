const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El titulo es obligatorio'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    category: {
      type: String,
      trim: true,
      maxlength: 50,
      default: 'General'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    dueDate: {
      type: Date,
      default: null
    },
    // Relacionar tarea con un documento de la colección users.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
