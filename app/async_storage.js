/* globals indexedDB */
/**
 * This file defines an asynchronous version of the localStorage API, backed by
 * an IndexedDB database.  It creates a global asyncStorage object that has
 * methods like the localStorage object.
 *
 * To store a value use setItem:
 *
 *   asyncStorage.setItem('key', 'value');
 *
 * If you want confirmation that the value has been stored, pass a callback
 * function as the third argument:
 *
 *  asyncStorage.setItem('key', 'newvalue', function() {
 *    console.log('new value stored');
 *  });
 *
 * To read a value, call getItem(), but note that you must supply a callback
 * function that the value will be passed to asynchronously:
 *
 *  asyncStorage.getItem('key', function(value) {
 *    console.log('The value of key is:', value);
 *  });
 *
 * Note that unlike localStorage, asyncStorage does not allow you to store and
 * retrieve values by setting and querying properties directly. You cannot just
 * write asyncStorage.key; you have to explicitly call setItem() or getItem().
 *
 * removeItem(), clear(), length(), and key() are like the same-named methods of
 * localStorage, but, like getItem() and setItem() they take a callback
 * argument.
 *
 * The asynchronous nature of getItem() makes it tricky to retrieve multiple
 * values. But unlike localStorage, asyncStorage does not require the values you
 * store to be strings.  So if you need to save multiple values and want to
 * retrieve them together, in a single asynchronous operation, just group the
 * values into a single object. The properties of this object may not include
 * DOM elements, but they may include things like Blobs and typed arrays.
 *
 * Unit tests are in apps/gallery/test/unit/asyncStorage_test.js
 */

var asyncStorage = (function() {
  'use strict';

  var DBNAME = 'asyncStorage';
  var DBVERSION = 1;
  var STORENAME = 'keyvaluepairs';
  var db = null;

  function withDatabase(f) {
    if (db) {
      f();
    } else {
      var openreq = indexedDB.open(DBNAME, DBVERSION);
      openreq.onerror = function withStoreOnError() {
        console.error('asyncStorage: can\'t open database:',
            openreq.error.name);
      };
      openreq.onupgradeneeded = function withStoreOnUpgradeNeeded() {
        // First time setup: create an empty object store
        openreq.result.createObjectStore(STORENAME);
      };
      openreq.onsuccess = function withStoreOnSuccess() {
        db = openreq.result;
        f();
      };
    }
  }

  function withStore(type, callback, oncomplete) {
    withDatabase(function() {
      var transaction = db.transaction(STORENAME, type);
      if (oncomplete) {
        transaction.oncomplete = oncomplete;
      }
      callback(transaction.objectStore(STORENAME));
    });
  }

  function getItem(key) {
    var req;
    return new Promise(function(resolve, reject) {
      withStore('readonly', function getItemBody(store) {
        req = store.get(key);
        req.onerror = function getItemOnError() {
          console.error('Error in asyncStorage.getItem(): ', req.error.name);
        };
      }, function onComplete() {
        var value = req.result;
        if (value === undefined) {
          value = null;
        }
        resolve(value);
      });
    });
  }

  function setItem(key, value) {
    return new Promise(function(resolve, reject) {
      withStore('readwrite', function setItemBody(store) {
        var req = store.put(value, key);
        req.onerror = function setItemOnError() {
          console.error('Error in asyncStorage.setItem(): ', req.error.name);
        };
      }, resolve);
    });
  }

  function removeItem(key) {
    return new Promise(function(resolve, reject) {
      withStore('readwrite', function removeItemBody(store) {
        var req = store.delete(key);
        req.onerror = function removeItemOnError() {
          console.error('Error in asyncStorage.removeItem(): ', req.error.name);
        };
      }, resolve);
    });
  }

  function clear(callback) {
    return new Promise(function(resolve, reject) {
      withStore('readwrite', function clearBody(store) {
        var req = store.clear();
        req.onerror = function clearOnError() {
          console.error('Error in asyncStorage.clear(): ', req.error.name);
        };
      }, resolve);
    });
  }

  function length() {
    var req;
    return new Promise(function(resolve, reject) {
      withStore('readonly', function lengthBody(store) {
        req = store.count();
        req.onerror = function lengthOnError() {
          console.error('Error in asyncStorage.length(): ', req.error.name);
        };
      }, function onComplete() {
        resolve(req.result);
      });
    });
  }

  function key(n) {
    return new Promise(function(resolve, reject) {
      if (n < 0) {
        resolve(null);
        return;
      }

      var req;
      withStore('readonly', function keyBody(store) {
        var advanced = false;
        req = store.openCursor();
        req.onsuccess = function keyOnSuccess() {
          var cursor = req.result;
          if (!cursor) {
            // this means there weren't enough keys
            return;
          }
          if (n === 0 || advanced) {
            // Either 1) we have the first key, return it if that's what they
            // wanted, or 2) we've got the nth key.
            return;
          }

          // Otherwise, ask the cursor to skip ahead n records
          advanced = true;
          cursor.advance(n);
        };
        req.onerror = function keyOnError() {
          console.error('Error in asyncStorage.key(): ', req.error.name);
        };
      }, function onComplete() {
        var cursor = req.result;
        resolve(cursor ? cursor.key : null);
      });
    });
  }

  return {
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key
  };
}());

module.exports = asyncStorage;
