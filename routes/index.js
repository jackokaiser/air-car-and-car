/*
 * GET home page.
 */

exports.index = function(env) {
    return function(req, res){
        res.render('index', {
            env : env
        });
    };
}

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};