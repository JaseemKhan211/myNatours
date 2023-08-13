const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
      name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        maxlenght: [40, 'A tour name must have or equal than 40 character'],
        minlenght: [10, 'A tour name must have or equal than 10 character'],
        validate: [validator.isAlpha, 'Tour name must only contain character'],
      },
      slug: String,
      duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
      },
      maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a maximium group size'],
      },
      difficulty: {
        type: String,
        required: [true, 'A tour must have a maximium group size'],
        enum: {
          values: ['easy', 'medium', 'difficult'],
          message: 'difficulty either: easy, medium and difficult',
        },
      },
      ratingsAverage: {
        type: Number,
        required: [true, 'A tour must have a ratings average number'],
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
      },
      ratingsQuantity: {
        type: Number,
        required: [true, 'A tour must have a ratings quantity'],
        default: 4.7
      },
      price: {
        type: Number,
        required: [true, 'A tour must have a price'],
        default: 4.5
      },
      priceDiscount: { 
        type: Number,
        validate: {
          validator: function(val) {
            return val < this.price;
          },
          message: 'Discount price ({VALUE}) should be below regular price',
        }
      },
      summary: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true,
        default: 'Easy' 
      },
      imageCover: {
        type: String
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false // permently hide the output
      },
      startDates: [Date],
      secretTour: {
        type: Boolean,
        default: false
      }
},
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true} 
});

tourSchema.virtual('durationweeks').get(function() {
  this.duration / 7;
});

// TODO: DOCUMENT MIDDLEWEAR: runs before .save and .create
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
  next();
});

tourSchema.pre('save', function(next) {
  console.log("Will save document...");
  next();
});

tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

// FIXME: QUERY MIDDLEWEAR
tourSchema.pre('find', function(next) {
  this.find({secretTour: {$ne: true}});
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} millisecond`);
  console.log(docs);
  (next);
});

// TODO: AGGREATE MIDDLEWEAR
tourSchema.pre('aggreate', function(next) {
  this.pipeline().unshift({ $match: { $secretTour: { $ne: true } } });
  
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;