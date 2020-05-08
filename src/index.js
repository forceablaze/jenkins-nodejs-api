"use strict";

import api from './api';
import axios from 'axios';
import { URL } from 'url';

const delay = (s) => {
  return new Promise(resolve => {
    setTimeout(resolve,s); 
  });
};

class JenkinsAPIClient
{
  constructor(url, username, apiToken) {
    this.hostURL = new URL(url)
    this.username = username;
    this.apiToken = apiToken;

    this.axios = null;
    this.requestTimeout = 6000;
    this.createAxiosInstance();

    this.APITYPE = '/api/json'
  }

  createAxiosInstance() {
    if(this.axios != null)
      return this.axiosInstance;

    //const auth = Buffer.from(this.username + ':' + this.apiToken).toString('base64');
    const axiosConfig = {
      baseURL: this.hostURL.href,
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

  sendRequest(method, requestPath) {
    const options = {
      method: method,
      url: requestPath,
    };

    return this.axios(options);
  }

  listAPI() {
    Object.keys(api).forEach((key) => {
      console.log(key, 'api path:', api[key])
    });
  }
}

class APIHelper
{

  static search(client, query) {
    const urlpath = api.SEARCH(query);

    return new Promise( async (resolve, reject) => {

      const response = await client.sendRequest('GET', urlpath);
      resolve(response.data.suggestions);
    });
  }

  static async getJenkinsInfo(client) {
    const urlpath = api.JENKINS_INFO + client.APITYPE;

    const response = await client.sendRequest('GET', urlpath);
    let str = '';
    str += response.data.description;
    str += `\nJob count: ${response.data.jobs.length}`

    return Promise.resolve(str);
  }

  static async buildJob(client, jobName) {
    const urlpath = api.BUILD(jobName);

    let response = await client.sendRequest('POST', urlpath);

    //await delay(10000);
    console.log('get build id');

    // get build url
    /*
    const lastBuild = await APIHelper.getLastBuild(client, jobName);
    console.log(lastBuild)
    */

    const job = await APIHelper.getJob(client, jobName);
    return new Promise((resolve) => {
      resolve(job.nextBuildNumber)
    })
  }

  static async getLastBuild(client, jobName) {
    let job = await APIHelper.getJob(client, jobName);
    const lastBuildAPIURL = job.lastBuild.url + client.APITYPE;

    const response = await client.sendRequest('GET', lastBuildAPIURL);
    console.log(`result: ${response.data.result}`);
    console.log(`timestamp: ${response.data.timestamp}`);
    console.log(`url: ${response.data.url}`);
    console.log(`duration: ${response.data.duration}`);

    return response.data;
  }

  static async getLastBuildResult(client, jobName) {
    const lastBuild = await APIHelper.getLastBuild(client, jobName);
    return new Promise(resolve => {
      resolve(lastBuild.result);
    });
  }

  static getJob(client, jobName) {
    const urlpath = api.JOB_INFO(jobName) + client.APITYPE;

    return new Promise((resolve, reject) => {
      client.sendRequest('GET', urlpath).
        then((response) => {
          resolve(response.data);
        }).
        catch((error) => {
          reject(error);
        });
    });
  }
}

const test = async () => {
  console.log('test')
  const client = new JenkinsAPIClient(
    'http://10.155.66.151/jenkins',
    'ipf3-system',
    '11d63b5d544a84e2eb2d55c23b0e62e838');

  client.listAPI();
  //APIHelper.getJenkinsInfo(client);
  try {
    //const buildId = await APIHelper.buildJob(client, 'manage-app-infrastructure');
    //console.log(`build id ${buildId}`);

    const info = await APIHelper.getJenkinsInfo(client);
    console.log(info);
    /*
    const searchResult = await APIHelper.search(client, 'check');
    searchResult.forEach((suggestion) => {
      console.log(`suggestion: ${suggestion.name}`);
    });
    */
  } catch (error) {
    console.log(error);
  };
  //const result = await APIHelper.getLastBuildResult(
  //    client, 'manage-app-infrastructure');
  //console.log(result);
}

//test()

export { JenkinsAPIClient, APIHelper };
