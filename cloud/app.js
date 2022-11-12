const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

app.set('views', __dirname + '/views');
app.set('view engine', 'twig');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes');