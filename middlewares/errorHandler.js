const errorHandler = (err, req, res, next) => {
    console.log(err)
    let status, message, error = []
  
    if (err.name === 'ValidationError') {
      status = 422
      for (let key in err.errors) {
        error.push(err.errors[key].message)
      }
      
    } else if (err.name === 'CastError') {
      status = 404
      error.push('Data tidak ditemukan.')
  
    } else {
      if (err.status) status = err.status
      else status = 400
      error.push(err.message)
    }
  
    res.status(status).json({ messages: error })
  }
  
  module.exports = errorHandler