Logger Class with log levels
****************************

This is a simple logger class with nice output, similar to systemd logging in Linux.


Sample output
=============

The logger output will look something like this::

    2020-07-04T19:51:02.743Z [detail] db-one.DBGenerator.attachReverseAssociationMethods:   attaching countUserUserData(userId)
    2020-07-04T19:51:02.744Z [MODULE] db-one.DBEnv: Written class code for _user (28889 bytes) to generated/GeneratedUserSession.js
                                      you can extend this class or use it as it is
    2020-07-04T19:51:02.744Z [MODULE] db-one.DBEnv: Setting session classes in session factory objects
    2020-07-04T19:51:02.745Z [ INFO ] db-one.DBLiveContext.initFactory: Initialising factory object
    2020-07-04T19:51:02.745Z [ INFO ] db-one.DBSessionFactory: Creating DBSessionFactory Object
    2020-07-04T19:51:02.751Z [ INFO ] db-one.DBLiveContext.initFactory: Initialising factory object
    2020-07-04T19:51:02.752Z [ INFO ] db-one.DBSessionFactory: Creating DBSessionFactory Object
    2020-07-04T19:51:02.753Z [ INFO ] db-one.DBLiveContext.initFactory: Initialising factory object
    2020-07-04T19:51:02.754Z [ INFO ] db-one.DBSessionFactory: Creating DBSessionFactory Object
    2020-07-04T19:51:02.754Z [ INFO ] db-one.DBEnv.loadModels: Loading system specific models
    2020-07-04T19:51:02.755Z [ INFO ] db-one.DBContext.loadModels: Loading Models
    2020-07-04T19:51:02.755Z [ INFO ] db-one.ModelLoader.loadModels: Load Models, count = 3
    2020-07-04T19:51:02.758Z [MODULE] db-one.DBEnv.connect: Connecting to database
    2020-07-04T19:51:02.758Z [ INFO ] db-one.DBCore.authenticate: Authenticating to database
    2020-07-04T19:51:02.864Z [ PSQL ] db-one.query: Executing (default): SELECT 1+1 AS result
    2020-07-04T19:51:02.865Z [ INFO ] db-one.DBCore.initialise: Database connection to 'localhost/dbone' successful

It includes timestamps, colors for log levels and proper text indentation and wrapping. The logging entities are easily
configured.


How to include
==============

After installing via npm, use require::

    const logger = require("logger-one").getInstance();

The logger uses a singleton pattern so that all settings apply throughout your entire project.
However, if you want a logger that is specific to a file or module, the singleton pattern is not
mandatory. You can initialize a new logger object::

    const Logger = require("logger-one");

    let logger = new Logger();


How to use
==========

There are multiple log levels and corresponding functions. Calling them will create a log output similar to this::

    <timestamp> [<level>] <service>.<class> <id> <log text>
                          <more log text>
                          <even more log text>

The predefined log levels and functions are:

    * `detail`: lowest possible level, displays <level> in gray
    * `sql`: specific log level for sql commands, displays <level> in cyan and <log text> in gray
    * `info`: informative log message, displays <level> in green
    * `sess`: session specific informative message, displayes <level> in green and bold
    * `warn`: warning message, displayes <level> in yellow and bold
    * `module`: module-level informative messages (such as "starting up"), displays <level> in green and bold and text in bold
    * `error`: error message, displays <level> in red and bold

To call the function::

    logger.info(text, cls, service, id)

The `<id>` argument is optional and can be used for session ids, for instance. Class argument can include the function as
well, for instance::

    logger.info("Running setup", "Application.setup", "app");


Module bindings
===============

A module binding is a custom wrapping around the Logger instance. This is a good option if we want to preserve the
singleton pattern (so, same configuration throughout the project) but have some level of customization. To get a module
binding, use::

    const logger = require("logger-one").getInstance().moduleBinding(cls, service);

Where `cls` and `service` are class and service names that will be used by default whenever calling a log function on the
binding. So, instead of::

    const logger = require("logger-one").getInstance();
    logger.info("Running setup", "Application.setup", "app");

You can use a module binding in the file and only specify the function name in the log function call::

    const logger = require("logger-one").getInstance().moduleBinding("Application", "app");
    logger.info("Running setup", "setup");


Configuring the logger object
=============================

If you use the singleton pattern (by calling `getInstance()`), configuration options will apply throughout your project.

This is a list of configuration methods.


setColors(arr)
--------------

Applies color settings to all log text output.

* `arr`: array of strings, a list of colors to apply to output log text. The options are the same used by the `colors`
  package, which this library is using

Example::

    logger.setColors([ "gray", "bold" ]); // makes all output gray and bold


setLevel(level)
---------------

Sets logging level (logger instance will not display any message lower than this level).

* `level`: string, one of the levels specified below

Level order, from lowest to highest, is: `detail`, `sql`, `info`, `sess`, `warn`, `module`, `error`.

Example::

    logger.setLevel("warn");
    logger.info("This will not be displayed");
    logger.warn("This will be displayed");
    logger.error("This as well");


setConsoleWidth(width)
----------------------

Sets the wrapping width in characters. The logger will automatically try to get the output width from the console,
however if writing to a file this does not apply so the width will be automatically set to 260. You can call this
method to change this setting.

* `width`: number, the wrapping width


getConsoleWidth()
-----------------

Returns the current console width used by the logger.


setLogFunction()
----------------

The log function used by the logger. By default, it's the `formattedOutput` methods of the logger object, but you
can change it to anything as long as it uses `console.log()` syntax (arguments will be merged together as one output
line). Replacing this will, of course, remove all the neat formatting and you'll have to handle that yourself.


resetLogFunction()
------------------

Sets the log function back to the built-in default.


isActiveLevel(level)
--------------------

Check if `level` should be displayed or not, based on the set logging level. Example::

    logger.setLevel("warn");
    logger.isActiveLevel("info"); // returns false
    logger.isActiveLevel("warn"); // returns true
    logger.isActiveLevel("error"); // returns true


Advanced logging functionality
==============================

There is some built-in functionality for logging objects and integer masks. These are implemented as static functions
of the Logger class.


Logger.expand(logFn, obj, name, cls, service, id)
-------------------------------------------------

"Expand" an object and log all properties individually.

* `logFn`: the logging function to use, eg logger.info
* `obj`: object to display
* `name`: root name of the object, eg `input` or `config`
* `cls`, `service`, `id`: same as the logging functions

Example::

    const Logger = require("logger-one");
    const logger = Logger.getInstance();

    let o = { a: 42, b: { c: "hello world", d: null } };
    Logger.expand(logger.info, o, "obj");
    // displays something like
    // [ INFO ] obj.a: 42
    // [ INFO ] obj.a.b.c: "hello world"
    // [ INFO ] obj.a.b.d: null


Logger.mapInt (logFn, value, obj, name, cls, service, id)
---------------------------------------------------------

Expands and logs properties defined by an int mask.

* `logFn`: the logging function to use, eg logger.info
* `value`: the int value to display as flags
* `obj`: an object containing keys and values for each flag
* `name`: root name of the object, eg `input` or `config`
* `cls`, `service`, `id`: same as the logging functions

Example::

    const Logger = require("logger-one");
    const logger = Logger.getInstance();

    let allProps = { PROPERTY1: 1, PROPERTY2: 2, PROPERTY3: 4 };
    let prop = allProps.PROPERTY1 | allProps.PROPERTY3;
    logger.mapInt(logger.info, prop, allProps, "prop");
    // displays something like
    // prop.PROPERTY1: true
    // prop.PROPERTY2: false
    // prop.PROPERTY3: true


