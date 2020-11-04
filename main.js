const isProd = () => {
  if (testEnv.name === 'testEnv') {
    return false
  } else {
    return true
  }
}

// export default ()