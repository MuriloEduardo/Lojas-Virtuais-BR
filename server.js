let express  = require('express');  
let app 	 = express();  
let server   = require('http').createServer(app);  
let io 		 = require('socket.io')(server);
let chokidar = require('chokidar');
let request  = require('request');
let fs 	   	 = require('fs');
let path 	 = require('path');
let watcher  = chokidar.watch('layouts', {ignored: /^\./, persistent: true});

require('events').EventEmitter.prototype._maxListeners = 100;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/node_modules'));

app.get('/Cod_Loja/:Cod_Loja', function(req, res) {
    res.render('index', {Cod_Loja: req.params.Cod_Loja, random: Math.floor((Math.random() * 198232) + 1)});
});

watcher.on('change', (path) => {
	
	console.log('arquivo atualizado', path);
	
	let file 	 = fs.readFileSync(path, 'utf8');
	let Cod_Loja = path.split('layouts/Cod_Loja=')[1].split('/')[0];

	let headers = {
		'Cookie': 'PHPSESSID=3qnldamd22bapnqjssmn6co397;'
	};

	let options = {
		url: 'https://www.lojasvirtuais-br.com.br/adm/json/loja_layout_avancado.php',
		method: 'POST',
		headers: headers,
		form: {
			'Cod_Loja': Cod_Loja,
			'html_avancado': file
		}
	};

	request(options, function (error, response, body) {
		console.log('Change_Document', body);
		io.emit('Change_Document', {body: body});
	});
});

server.listen(8080, function() {
	console.log('Rodando em 8080');
});