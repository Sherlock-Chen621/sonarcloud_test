'use strict';

import pino from 'pino';

const logger = pino({
  prettyPrint: true
});

export default logger;
