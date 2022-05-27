import { KeyPair } from './key-pair.type';

export interface SignedPreKey {
  keyId: number;

  keyPair: KeyPair;

  signature: ArrayBuffer;
}
