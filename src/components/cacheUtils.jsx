import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY;

export const cacheData = async (key, data) => {
  const jsonString = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();

  if ("caches" in window) {
    try {
      const cache = await caches.open(key);
      await cache.put(key, new Response(encrypted));
      console.log("Encrypted & Cached:", encrypted);
    } catch (err) {
      console.error("Error caching data:", err);
    }
  }
};

export const getCachedData = async (key) => {
  if ("caches" in window) {
    try {
      const cache = await caches.open(key);
      const response = await cache.match(key);

      if (response) {
        const encryptedText = await response.text();

        // Decrypt
        const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        
        return decryptedData;
        
      }
    } catch (err) {
      console.error("Error retrieving cached data:", err);
    }
  }

  return null;
};
