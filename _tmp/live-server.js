
var liveServer = require("live-server");

var params = {
	port: 57538, // Set the server port. Defaults to 8080.
	host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
	root: "./public", // Set root directory that's being served. Defaults to cwd.
	wait: 500, // Waits for all changes, before reloading. Defaults to 0 sec.
	logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
};
liveServer.start(params);