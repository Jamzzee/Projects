import { TIMEOUT_SEC } from './config';

// Function to handle timeouts
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// AJAX function for making GET and POST requests
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Check if there is uploadDaata (for a POST request) or not (for a GET request)
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url); // If uploadData is undefined, make a GET request to the specified URL

    // Wait for either the fetch request or a timeout (Promise.race)
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // Parse the response body as JSON
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
