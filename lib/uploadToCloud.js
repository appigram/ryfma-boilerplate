const uploadBlobToS3 = (uploader, canvas) => {
  if (canvas) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob((blob) => {
        const errorBlob = uploader.validate(blob)
        if (errorBlob) {
          console.error(errorBlob)
          return
        }

        uploader.send(blob, (error, src) => {
          if (error) {
            console.error('Error uploading: ', error)
            reject(error)
          } else {
            resolve(src)
          }
        })
      },
      'image/jpeg',
      0.75
      )
    })
  } else {
    return new Promise(function (resolve, reject) {
      const error = 'Canvas not found'
      reject(error)
    })
  }
}

const uploadRawBlobToS3 = (uploader, blob) => {
  if (blob) {
    return new Promise(function (resolve, reject) {
      const errorBlob = uploader.validate(blob)
      if (errorBlob) {
        console.error(errorBlob)
        return
      }

      uploader.send(blob, (error, src) => {
        if (error) {
          console.error('Error uploading: ', error)
          reject(error)
        } else {
          resolve(src)
        }
      })
    })
  } else {
    return new Promise(function (resolve, reject) {
      const error = 'Blob not found'
      reject(error)
    })
  }
}


export { uploadBlobToS3, uploadRawBlobToS3 }
