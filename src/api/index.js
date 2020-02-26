let BUILD_TEMPLATE = (jobName) => {
  return `/job/${jobName}/build`
}

export default {
  JENKINS_INFO: '',
  BUILD: BUILD_TEMPLATE,

  BUILD_WITH_PARAMS: (jobName) => {
    return `/job/${jobName}/buildWithParameters`
  },

  JOB_INFO: (jobName) => {
    return `/job/${jobName}`
  }
};
