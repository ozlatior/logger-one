const logger = require("../index.js").getInstance().moduleBinding("index", "test");
const instance = require("../index.js").getInstance();

describe ("Main functionality", () => {

	it ("Prints messages for different log levels", () => {
		instance.setLevel("detail");
		logger.detail("This is a detail message", "main");
		logger.sql("This is an SQL message", "main");
		logger.info("This is an info message", "main");
		logger.sess("This is a session message", "main");
		logger.warn("This is a warning message", "main");
		logger.module("This is a module level message", "main");
		logger.error("This is an error message", "main");
	});

	it ("Prints messages for different log levels above specific level", () => {
		instance.setLevel("warn");
		logger.detail("This is a detail message", "main");
		logger.sql("This is an SQL message", "main");
		logger.info("This is an info message", "main");
		logger.sess("This is a session message", "main");
		logger.warn("This is a warning message", "main");
		logger.module("This is a module level message", "main");
		logger.error("This is an error message", "main");
	});

});
