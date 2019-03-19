module.exports = function logError(message, code) {
  console.error(`usrv: ${message}`)
  console.error(`usrv: ${code}`)
  // TODO: maybe link to an error discription
  // or start live customer support session?
}
