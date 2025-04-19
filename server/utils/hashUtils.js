
/**
 * Utility functions for hashing IPs and other values
 */
const crypto = require('crypto');

// Hash an IP address for anonymization
const hashIP = (ip) => {
  const hash = crypto.createHash('sha256');
  hash.update(ip);
  return hash.digest('hex');
};

module.exports = {
  hashIP
};
