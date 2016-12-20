"use strict";
const path = require('path');
const basePath = process.cwd();

const pkj = require(path.join(basePath,'package.json'));
var data = [];

var deploy = new Object({
    nombre: "deploy-heroku",
    tarea: `\n\ngulp.task("deploy-heroku", function(){`+
           `\n       require("gitbook-start-heroku-P9-josue-nayra").deploy();`+
           `\n});`
});

var destroy = new Object({
  nombre: "destroy-heroku",
  tarea: `\n\ngulp.task("destroy-heroku", function(){`+
          `\n     require('gitbook-start-heroku-P9-josue-nayra').destroy();`+
          `\n});`
});

data.push(deploy);
data.push(destroy);

exports.tareas = data;
