const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counterString = '0000') => {
    
    fs.writeFile(exports.dataDir + '/' + counterString + '.txt', text, err => {
      if (err) {
        console.log('Error: ', err);
      } else {
        console.log('Todo saved!');
        callback(null, {text, id: counterString});
      }
    });
  });
  
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, null, (err, files) => {
    files = files.map(file => {
      file = file.split('.')[0];
      return {id: file, text: file};
    });
    callback(null, files);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', null, (err, data) => {
    if (err) {
      // console.log('Error: ', err);
      callback(err, null);
    } else {
      callback(null, {id: id, text: data.toString()});
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
