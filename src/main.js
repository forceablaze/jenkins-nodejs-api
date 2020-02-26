"use strict";

import command from './command'

class JenkinsAPIClient
{
  constructor(url, apiToken) {
    this.url = url;
    this.apiToken = apiToken;
  }
}



const test = () => {
  console.log('test')
  const client = new JenkinsAPIClient();
}

test();
