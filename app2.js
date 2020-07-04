const mailer_ = require("./util/nodemail");

mailer_
  .login_(
    "zaroaringlamb@gmail.com",
    "tesing login app",
    "asun is life... I miss my boy "
  )
  .catch((err) => {
    console.log(err.message);
  });
