const uploadBlobToS3 = (uploader, canvas) => {
  return new Promise(function(resolve, reject) {
    canvas.toBlob((blob) => {
      const errorBlob = uploader.validate(blob);
      if (errorBlob) {
        console.error(errorBlob);
        return;
      }

      uploader.send(blob, (error, src) => {
        if (error) {
          console.error('Error uploading: ', error);
        }
        else {
          resolve(src);
        }
      });
    },
    'image/jpeg',
    0.98
    );
  });
};

export { uploadBlobToS3 };
