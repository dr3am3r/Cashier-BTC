export function requestError(err, req, res, next) {
  return next(err)
}

export function handleAll(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
}
