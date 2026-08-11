import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = '_encryption_key_';

const encryptData = <Data = unknown>(data: unknown): Data => {
  if (!data) return data as Data;

  try {
    if (Array.isArray(data)) {
      return data.map((item) => encryptData(item)) as Data;
    }

    if (typeof data === 'object') {
      return Object.entries(data).reduce((pre, [key, value]) => {
        return { ...pre, [key]: encryptData(value) };
      }, {} as Data);
    }

    if (typeof data === 'string') {
      const encrypted = CryptoJS.RC4.encrypt(data, ENCRYPTION_KEY).toString();
      return encrypted as Data;
    }

    return data as Data;
  } catch {
    throw new Error('Encryption failed');
  }
};

const decryptData = <Data = unknown>(encryptedData: unknown): Data => {
  if (!encryptedData) return encryptedData as Data;

  try {
    if (Array.isArray(encryptedData)) {
      return encryptedData.map((item) => decryptData(item)) as Data;
    }

    if (typeof encryptedData === 'object') {
      return Object.entries(encryptedData).reduce((pre, [key, value]) => {
        return { ...pre, [key]: decryptData(value) };
      }, {} as Data);
    }

    if (typeof encryptedData === 'string') {
      const bytes = CryptoJS.RC4.decrypt(encryptedData, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted as Data;
    }

    return encryptedData as Data;
  } catch {
    return encryptedData as Data; // Return original data if decryption fails
  }
};

export { encryptData, decryptData };
