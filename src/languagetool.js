// remove dependency node-languagetool
// const lt = require('node-languagetool');

module.exports = function(config) {
  function check(text, language) {
    // if (!config.api) {
    //   return lt.check(text, config.language)
    // }

    // return new pending promise
    return new Promise((resolve, reject) => {
      // select http or https module, depending on requested url
      const lib = config.api.startsWith('https') ? require('https') : require('http');
      const url = `${config.api}/check?language=${language}&text=${encodeURIComponent(text)}`;
      const request = lib.get(url, (response) => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load page, status code: ' + response.statusCode));
        }
        // temporary data holder
        const body = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on('end', () => resolve(JSON.parse(body.join(''))));
      });
      // handle connection errors of the request
      request.on('error', (err) => reject(err));
    });
  }

  function kill() {
    // noop here. save compatibility with node-languagetool
  }

  return {
    check,
    kill,
  };
};
