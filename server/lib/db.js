var sec = require("./security");

function get(_d, _c, _q, cb) {
    cb = cb || {};
    sec.connect(db => {
        var dbo = db.db(_d);
        dbo.collection(_c).find(_q).toArray(result => {
            db.close();
            return cb(null, result);
        }).catch(err => {
            throw err;
        });
    }).catch(err => {
        throw err;
    });
}