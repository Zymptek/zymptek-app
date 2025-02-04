module.exports = (path, options) => {
  // Call the default resolver
  return options.defaultResolver(path, {
    ...options,
    packageFilter: pkg => {
      // This is a workaround for packages that distribute ESM modules
      if (pkg.type === 'module') {
        delete pkg.exports;
        delete pkg.type;
      }
      return pkg;
    },
  });
}; 