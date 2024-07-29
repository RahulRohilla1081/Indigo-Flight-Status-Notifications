const axios = {
  get: (url, params) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log("ASdakshbdhsa", responseData);
            resolve(responseData);
          } else {
            reject(new Error(`GET request failed with status ${xhr.status}`));
          }
        }
      };

      xhr.send();
    });
  },

  post: (url, data, headers) => {
    // console.log("dsfadsa", headers);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      const isFormData = data instanceof FormData;

      // "Content-Type", "application/json"
      xhr.open("POST", url, true);

      if (headers) {
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            resolve(responseData);
          } else {
            reject(new Error(`Request failed with status ${xhr.status}`));
          }
        }
      };
      if (isFormData) {
        console.log("Asdjkasbdhkas", data);
        xhr.send(data);
      } else {
        xhr.setRequestHeader("Content-Type", "application/json");
        console.log("ASdhasbdas", data);
        xhr.send(JSON.stringify(data));
      }

      // xhr.send(JSON.stringify(data));
    });
  },

  // post: (url, data, headers) => {
  //   return new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open("POST", url, true);

  //     // Check if the data is FormData
  //     const isFormData = data instanceof FormData;

  //     console.log("ASdasdasd", data);
  //     // Set headers
  //     if (!isFormData) {
  //       xhr.setRequestHeader("Content-Type", "application/json");
  //     }

  //     if (headers) {
  //       Object.keys(headers).forEach((key) => {
  //         xhr.setRequestHeader(key, headers[key]);
  //       });
  //     }

  //     xhr.onreadystatechange = function () {
  //       if (xhr.readyState === 4) {
  //         console.log("ASDasdas", xhr);
  //         if (xhr.status === 200) {
  //           const responseData = JSON.parse(xhr.responseText);
  //           resolve(responseData);
  //         } else {
  //           reject(new Error(`POST request failed with status ${xhr.status}`));
  //         }
  //       }
  //     };

  //     // Send FormData or JSON data based on the type
  //     if (isFormData) {
  //       xhr.send(data);
  //     } else {
  //       xhr.send(JSON.stringify(data));
  //     }
  //   });
  // },

  // Similar methods for other HTTP methods (e.g., delete) can be added here
};

export default axios;
