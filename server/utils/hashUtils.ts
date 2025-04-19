
import * as crypto from 'crypto';

const hashIP = (ip: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(ip);
  return hash.digest('hex');
};

export { hashIP };
