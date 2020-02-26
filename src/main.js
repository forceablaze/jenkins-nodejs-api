"use strict";

import api from './api';
import axios from 'axios';
import { URL } from 'url';

class JenkinsAPIClient
{
  constructor(url, username, apiToken) {
    this.hostURL = new URL(url)
    this.username = username;
    this.apiToken = apiToken;

    this.axios = null;
    this.requestTimeout = 6000;
    this.createAxiosInstance();

    this.APITYPE = 'api/json'
  }

  createAxiosInstance() {
    if(this.axios != null)
      return this.axiosInstance;

    //const auth = Buffer.from(this.username + ':' + this.apiToken).toString('base64');
    const axiosConfig = {
      baseURL: this.url,
      /*
      headers: {
        'Authorization': 'Basic ' + auth
      },
      */
      auth: {
        username: this.username,
        password: this.apiToken,
      },
      timeout: this.requestTimeout,
    };

    this.axios = axios.create(axiosConfig);
  }

  sendRequest(requestURL) {
    this.axios.get(requestURL).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.log(error.response.data);
    });
  }

  listAPI() {
    Object.keys(api).forEach((key) => {
      console.log(key, 'api path:', api[key])
    });
  }
}

class APIHelper
{
  static getJenkinsInfo(client) {
    const urlpath = client.hostURL.pathname +
      api.JENKINS_INFO + client.APITYPE;
    const requestURL = new URL(urlpath, client.hostURL);
    console.log(requestURL);

    client.sendRequest(requestURL.href)
  }
}


const test = () => {
  console.log('test')
  const client = new JenkinsAPIClient(
    'http://10.155.66.151/jenkins',
    'ipf3-system',
    '11d63b5d544a84e2eb2d55c23b0e62e838',
  );

  client.listAPI();
  APIHelper.getJenkinsInfo(client);
}

test();
