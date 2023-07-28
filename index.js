
exports.handler = async (event) => {
  process.on("warning", (warning) =>
    console.warn("warning stacktrace - " + warning.stack)
  );
  console.log('event',event)
  const respone = {
    statusCode: 200,
    body: 'HI',
  };

  return respone.body;
};
