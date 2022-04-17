import { IncomingMessage } from 'http';
import * as https from 'https';

export function requestHelper (url: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
  return new Promise((resolve, reject) => {
    return https.get(url, (res: IncomingMessage) => {
      res.setEncoding(encoding);

      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err: Error) => {
      reject(err);
    });
  });
}
