module.exports = function asyncMiddleware(handler: any) {
  return async (req: any, res: any, next: any) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
