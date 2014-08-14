var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),

	util = require('util'),
	_ = require('underscore'),
	path = require('path'),
	exec = require('child_process').exec,
	config = require('./config.json'),
	deployHistory = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.json(deployHistory);
});

app.post('/', function(req, res) {
	var branch = req.body.ref.split('/').slice(-1)[0],
		reponame = req.body.repository.name, 
		repoConfigs = _.where(config.hooks, { reponame: reponame }),
		username = req.body.user_name,
		branchConfigs, branchConfig;

	if (_.some(repoConfigs)) {
		// Further refine list to only get branch config
		branchConfigs = _.where(repoConfigs, { branch: branch });

		if (_.some(branchConfigs)) {
			branchConfig = _.first(branchConfigs);

			addToHistory(reponame, branch, username, true);
			executePostReceiveScript(branchConfig);
		} else {
			var noBranchMessage = util.format('No configs found for branch "%s" on repository "%s"', branch, reponame);

			addToHistory(reponame, branch, username, noBranchMessage);
			console.log(noBranchMessage);
			
			return;
		}
	} else {
		var noRepoConfiguredMsg = util.format('No configs found for repository %s', reponame);

		addToHistory(reponame, branch, username, noRepoConfiguredMsg);
		console.log(noRepoConfiguredMsg);
		return;
	}

	res.status(200).end();
});

app.listen(config.port, function() {
	console.log('Listening on port %s for deploy hooks', config.port);
});

function executePostReceiveScript(config, username) {
	var branch = config.branch,
		script = config.script,
		reponame = config.reponame,
		user = config.runas;
		command = util.format('sudo -u %s %s', user, script);


	exec(command, { cwd: path.dirname(script)  }, function(error, stdout, stderr) {
		console.log(stdout);

		if (error) {
			var errMsg = util.format('Error: ', error, stderr);
			console.log(errMsg);
			addToHistory(reponame, branch, username, errMsg);
		} else {
			addToHistory(reponame, branch, username, stdout);
		}
	});	
}

function addToHistory(reponame, branchname, username, message) {
	deployHistory.push({
		datetime: new Date(),
		reponame: reponame,
		branchname: branchname,
		username: username,
		message: message
	});
}
