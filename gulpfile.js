'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var bower_package = require('./bower.json');
require('../utils/gulp-master')(gulp, bower_package);

var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var minimist = require('minimist');


var knownOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'production'
  }
};

var options = minimist(process.argv.slice(2), knownOptions);

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
  var app = gulp.src([
    '*.html',
    'moment.min.js'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/elements'));

  var bower = gulp.src([
    'bower_components/**/*'
  ]).pipe(gulp.dest('dist'));

  var vulcanized = gulp.src(['cloudstitch-breaking-news-feed.html'])
    .pipe($.rename('cloudstitch-breaking-news-feed.vulcanized.html'))
    .pipe(gulp.dest('dist/elements'));
});


// Vulcanize imports
gulp.task('vulcanize', function () {
  var DEST_DIR = '.';
  return gulp.src('dist/elements/cloudstitch-breaking-news-feed.vulcanized.html')
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true,
    }))
    .pipe(gulp.dest('dist/elements'))
    .pipe($.size({title: 'vulcanize'}));
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence(
    'copy',
    'vulcanize',
    cb);
    // Note: add , 'precache' , after 'vulcanize', if your are going to use Service Worker
});
