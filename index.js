const core = require('@actions/core');
const client = require('./src/client.js');
const fs = require('node:fs');
const {mkdirp} = require('mkdirp');
const dirname = require('path').dirname

try {
  const owner = core.getInput('owner');
  const repo = core.getInput('repo');
  const name = core.getInput('name');
  const path = core.getInput('path');
  client.request(owner, repo, name)
    .then((stats) => {
      const content = JSON.stringify(stats, null, 2)
      mkdirp(dirname(path)).then(() => {
        fs.writeFileSync(path, content)
      })
    })
} catch (error) {
  core.setFailed(error.message);
}
