import { fetch } from 'meteor/fetch'

/**
 * @fileOverview Defines client side API in which files can be uploaded.
 */

/**
 *
 * @param {string} directive - Name of server-directive to use.
 * @param {object} [metaData] - Data to be sent to directive.
 * @constructor
 */

Slingshot.Upload = function (directive, metaData) {

  if (!window.File || !window.FormData) {
    throw new Error("Browser does not support HTML5 uploads");
  }

  var self = this,
      dataUri;

  function buildFormData() {
    var formData = new window.FormData();

    if (Array.isArray(self.instructions.postData)) {
      self.instructions.postData.forEach(function (field) {
        formData.append(field.name, field.value);
      });
    }

    formData.append("file", self.file);

    return formData;
  }

  Object.assign(self, {

   /**
    * @param {File} file
    * @returns {null|Error} Returns null on success, Error on failure.
    */

    validate: function(file) {
      var context = {
        userId: Meteor.userId && Meteor.userId()
      };
      try {
        var validators = Slingshot.Validators,
            restrictions = Slingshot.getRestrictions(directive);

        validators.checkAll(context, file, metaData, restrictions) && null;
      } catch(error) {
        return error;
      }
    },

    /**
     * @param {(File|Blob)} file
     * @param {Function} [callback]
     * @returns {Slingshot.Upload}
     */

    send: function (file, callback) {
      if (!(file instanceof window.File) && ! (file instanceof window.Blob))
        throw new Error("Not a file");

      self.file = file;

      self.request(function (error, instructions) {
        if (error) {
          return callback(error);
        }

        self.instructions = instructions;

        self.transfer(callback);
      });

      return self;
    },

    /**
     * @param {Function} [callback]
     * @returns {Slingshot.Upload}
     */

    request: function (callback) {

      if (!self.file) {
        callback(new Error("No file to request upload for"));
      }

      var file = {
        name: self.file.name,
        size: self.file.size,
        type: self.file.type
      };

      var error = this.validate(file);
      if (error) {
        callback(error);
        return self;
      }

      const url =  "/methods/slingshot/uploadRequest"
      const params = {
        directiveName: directive, file, meta: metaData
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.send(JSON.stringify(params));
      xhr.addEventListener("load", () => {
        const reqResult = xhr.responseText;
        if (reqResult) {
          const instructions = JSON.parse(reqResult)
          callback(error, instructions);
        }
      })


      /* Meteor.call("slingshot/uploadRequest", directive,
        file, metaData, function (error, instructions) {
          callback(error, instructions);
        }); */

      return self;
    },

    /**
     * @param {Function} [callback]
     *
     * @returns {Slingshot.Upload}
     */

    transfer: function (callback) {
      var xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
        }
      }, false);

      function getError() {
        return new Meteor.Error(xhr.statusText + " - " + xhr.status,
            "Failed to upload file to cloud storage");
      }

      xhr.addEventListener("load", function () {

        if (xhr.status < 400) {
          callback(null, self.instructions.download);
        }
        else {
          callback(getError());
        }
      });

      xhr.addEventListener("error", function () {
        callback(getError());
      });

      xhr.addEventListener("abort", function () {
        callback(new Meteor.Error("Aborted",
          "The upload has been aborted by the user"));
      });

      xhr.open("POST", self.instructions.upload, true);

      if (Array.isArray(self.instructions.headers)) {
        self.instructions.headers.forEach(function (value, key) {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.send(buildFormData());
      self.xhr = xhr;

      return self;
    },

    /**
     * @returns {boolean}
     */

    isImage: function () {
      return Boolean(self.file && self.file.type.split("/")[0] === "image");
    },

    /**
     * Latency compensated url of the file to be uploaded.
     *
     * @param {boolean} preload
     *
     * @returns {string}
     */

    url: function (preload) {
      if (!dataUri) {
        var URL = (window.URL || window.webkitURL);
        var localUrl = null
        if (self.file && URL) {
          localUrl = URL.createObjectURL(self.file)
        } else if (window.FileReader) {
          readDataUrl(self.file, function (result) {
            localUrl = result;
          });
        }
      }

      return dataUri;
    },

    /** Gets an upload parameter for the directive.
     *
     * @param {String} name
     * @returns {String|Number|Undefined}
     */

    param: function (name) {
      var data = self.instructions && self.instructions.postData;
      var field = Array.isArray(data) && data.find(function (a) { return a.name === name; });

      return field && field.value;
    }

  });
};

/**
 *
 * @param {String} image - URL of image to preload.
 * @param {Function} callback
 */

function preloadImage(image, callback) {
  var preloader = new window.Image();

  preloader.onload = callback;

  preloader.src = image;
}

function readDataUrl(file, callback) {
  var reader = new window.FileReader();

  reader.onloadend = function () {
    callback(reader.result);
  };

  reader.readAsDataURL(file);
}
