const errorHandler = (err, req, res, next) => {
  let status, error = []
  if (err.status && err.message) {
    status = err.status
    error.push(err.message)
  } else if (err.name === 'ValidationError') {
    status = 422
    for (let key in err.errors) {
      error.push(err.errors[key].message)
    }
  } else if (err.name === 'CastError') {
    status = err.status || 404
    error.push('data not found')
  } else {
    status = err.status || 400
    error.push(err.message)
  }

  res.status(status).json({ messages: error })
}

module.exports = errorHandler