const lib = process.cwd() + '/lib/';
const config = require(lib + 'config');
const log = require(lib + 'log')(module);
const app = require(lib + 'app');


app.set('port', process.env.PORT || config.get('port') || 3000);

const server = app.listen(app.get('port'), () =>
  log.info('Express server listening on port ' + app.get('port'))
);
