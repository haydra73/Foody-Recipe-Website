import { TIMEOUT_SEC } from './config';

const timeout = time => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      reject(new Error(`request took too long! Timeout after ${time} seconds`));
    }, time * 1000);
  });
};

export const getJSON = async url => {
  try {
    const fetchFunc = fetch(url);

    const res = await Promise.race([fetchFunc, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        `Something went wrong and had an error of ${data.message}`
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async (url, uploadData) => {
  try {
    const fetchFunc = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchFunc, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        `Something went wrong and had an error of ${data.message}`
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteJSON = async (url) => {
  try {
    const res = await fetch(url, {
        method: "DELETE"
    })
    const data = await res.text();

    return data
  } catch (error) {
    throw error;
  }
};
