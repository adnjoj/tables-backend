// eslint-disable-next-line @typescript-eslint/no-var-requires
const ByteBuffer = require('bytebuffer');

/*
@author Akash Singh
@email contact@akashsingh.io
@web akashsingh.io
*/

export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export const util = {
  toString: function (thing) {
    if (typeof thing == 'string') {
      return thing;
    }
    return new ByteBuffer.wrap(thing).toString('binary');
  },
};
