const { validationResult } = require("express-validator");

const validate = (validators) => {
  return async (req, res, next) => {
    await Promise.all(validators.map((validator) => validator.run(req)));

    const errors = validationResult(req);
    console.log(errors.array());

    if (!errors.isEmpty()) {
      return res.status(401).json({ error: errors.array() });
    }
    next();
  };
};

module.exports = validate;
