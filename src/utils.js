import createHmac from 'create-hmac'

export const getTimestampExpiresInMinutes = (minutes) => {
  return Math.ceil((Date.now() / 1000) + minutes * 60)
}

export const getSignatureString = (sigObj) => {
  var header = 'SharedAccessSignature '
  var qstr = ['sr', 'sig', 'se', 'skn']
    .map((key) => {
      if (!sigObj[key]) {
        return null
      }
      return key + '=' + sigObj[key]
    }, '')
    .filter(_ => _)
    .join('&')
  return header + qstr
}

export const createBase64SasToken = (encodedResourceUri, signingKey, expireTimestamp) => {
  // Set expiration in seconds
  const toSign = encodedResourceUri + '\n' + expireTimestamp
  const hmac = createHmac('sha256', new Buffer(signingKey, 'base64'))
  hmac.update(toSign)
  const digest = hmac.digest('base64')
  return encodeURIComponent(digest)
}

export const createSignatureObj = (hostName, policyName, sas, expireTimestamp) => {
  const encodedHostName = encodeURIComponent(hostName)
  const result = {
    _key: sas,
    sr: encodedHostName,
    se: expireTimestamp,
    sig: createBase64SasToken(encodedHostName, sas, expireTimestamp)
  }
  if (policyName) {
    result.skn = policyName
  }
  return result
}

export const parseConnectionString = (connStr) => {
  return connStr
    .split(';')
    .reduce((prev, curr, index) => {
      const searchInd = curr.search('=')
      const key = curr.slice(0, searchInd)
      const value = curr.slice(searchInd + 1)
      prev[key] = value
      return prev
    }, {})
}

export const getHostNameFromEndpoint = (endpoint) => {
  return endpoint.slice(5, -1)
}
