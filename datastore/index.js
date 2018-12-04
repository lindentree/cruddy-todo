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
      callback(err, null);
    } else {
      callback(null, {id, text: data.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, null, (err, files) => {
    if (err) {
      return;
    } else {
      if (files.includes(id + '.txt')) {
        fs.writeFile(exports.dataDir + '/' + id + '.txt', text, err => {
          callback(null, {id, text});
        }); 
      } else {
        callback('File does not exist');
      }        
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', err => {
    if (err) {
      callback('File does not exist');
    } else {
      callback();
    }
  }); 
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
