exports.onHandleCode = function (ev)
{
  ev.data.code = ev.data.code
    .replace(/module\.exports = /g, 'export default ')
    .replace(/exports = /g, 'export default ');
  ev.data.code = ev.data.code
    .replace(/const (\W+) = require\(([^)]+)\);/g, 'import * as $1 from $2;');
    
  ev.data.code = ev.data.code
    .replace(/const\s+([{][^}+][}])\s+= require\(([^)]+)\);/g, 'import $1 from $2;');

  ev.data.code = ev.data.code
    .replace(/module.exports.([A-Za-z0-9]+) = /g, 'export const $1 = ');
};
