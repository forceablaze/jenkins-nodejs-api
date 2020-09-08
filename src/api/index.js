let BUILD_TEMPLATE = (jobName) => {
  return `/job/${jobName}/build`
}

export default {
  JENKINS_INFO: '',

  SEARCH: (query) => {
    return `/search/suggest?query=${query}`
  },

  BUILD: BUILD_TEMPLATE,

  BUILD_WITH_PARAMS: (jobName) => {
    return `/job/${jobName}/buildWithParameters`
  },

  JOB_INFO: (jobName) => {
    return `/job/${jobName}`
  },

  BUILD_INFO: (jobName, buildId) => {
    return `/job/${jobName}/${buildId}`
  }

};
