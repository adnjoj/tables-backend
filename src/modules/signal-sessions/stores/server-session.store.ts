/* eslint-disable @typescript-eslint/no-var-requires */
const {
  KeyHelper,
  SignalProtocolAddress,
  SessionBuilder,
  SessionCipher,
} = require('libsignal-protocol-nodejs');

import { SignalProtocolStore } from '../signal-utils/store.js';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from '../signal-utils/util.js';

import { KeyPair } from '../types/key-pair.type.js';
import { PreKey } from '../types/pre-key.type.js';
import { PreKeyToSend } from '../types/pre-key-to-send.type.js';
import { SignedPreKey } from '../types/signed-pre-key.type.js';
import { SignalConnection } from '../types/signal-connection.type.js';

export class ServerSessionStore {
  private _userId = 0;
  private _registrationId: number;
  private _identityKeyPair: KeyPair;
  private _preKeys = new Array<PreKey>();
  private _preKeysToSend = new Array<PreKeyToSend>();
  private _signedPreKey: SignedPreKey;

  private readonly _store = new SignalProtocolStore();

  constructor() {
    this.generateKeys();
  }

  private async generateKeys(): Promise<void> {
    this._registrationId = KeyHelper.generateRegistrationId();
    this._store.put('registrationId', this._registrationId);

    this._identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    this._store.put('identityKey', this._identityKeyPair);

    this.generatePreKeys();
    this.generateSignedPreKey();
  }

  private async generatePreKeys(): Promise<void> {
    const preKeysPromises = [];

    for (let i = 1; i <= 10; i += 1) {
      preKeysPromises.push(KeyHelper.generatePreKey(this._registrationId + i));
    }

    const preKeys = await Promise.all(preKeysPromises);

    preKeys.forEach(({ keyId, keyPair }) => {
      this._preKeys.push({ keyId, keyPair });
      this._store.storePreKey(keyId, keyPair);

      this._preKeysToSend.push({
        id: keyId,
        key: arrayBufferToBase64(keyPair.pubKey),
      });
    });
  }

  private async generateSignedPreKey(): Promise<void> {
    const { keyId, keyPair, signature } = await KeyHelper.generateSignedPreKey(
      this._identityKeyPair,
      this._registrationId - 1,
    );

    this._signedPreKey = { keyId, keyPair, signature };
    this._store.storeSignedPreKey(keyId, keyPair);
  }

  getDataToSend() {
    const preKey = this._preKeysToSend.pop();
    this._preKeys.pop();

    return {
      userId: this._userId,
      registrationId: this._registrationId,
      identityKey: arrayBufferToBase64(this._identityKeyPair.pubKey),
      signedPreKey: {
        id: this._signedPreKey.keyId,
        key: arrayBufferToBase64(this._signedPreKey.keyPair.pubKey),
        signature: arrayBufferToBase64(this._signedPreKey.signature),
      },
      preKeys: this._preKeysToSend,
      preKey,
    };
  }

  async createSession(connection: SignalConnection) {
    const connectionPreKey = connection.preKeys.pop();

    const processedConnection = {
      registrationId: connection.registrationId,
      identityKey: base64ToArrayBuffer(connection.identityKey),
      signedPreKey: {
        keyId: connection.signedPreKey.id,
        publicKey: base64ToArrayBuffer(connection.signedPreKey.key),
        signature: base64ToArrayBuffer(connection.signedPreKey.signature),
      },
      preKey: {
        keyId: connectionPreKey.id,
        publicKey: base64ToArrayBuffer(connectionPreKey.key),
      },
    };

    const recipientAddress = new SignalProtocolAddress(
      connection.registrationId,
      connection.userId,
    );

    console.log(recipientAddress);

    const sessionBuilder = new SessionBuilder(this._store, recipientAddress);

    await sessionBuilder.processPreKey(processedConnection);

    console.log('Success! Session Established!');
  }

  encryptMessage(
    receiverUserId: number,
    receiverRegistrationId: number,
    message: string,
  ): Promise<any> {
    const address = new SignalProtocolAddress(
      receiverRegistrationId,
      receiverUserId,
    );

    return new SessionCipher(this._store, address).encrypt(message);
  }

  async decryptMessage(
    senderUserId: number,
    senderRegistrationId: number,
    cipherText: any,
  ): Promise<string> {
    const address = new SignalProtocolAddress(
      senderRegistrationId,
      senderUserId,
    );

    const sessionCipher = new SessionCipher(this._store, address);

    const buffer = await sessionCipher.decryptPreKeyWhisperMessage(
      cipherText.body,
      'binary',
    );

    return new TextDecoder().decode(buffer);
  }
}
