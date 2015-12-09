var argv   = require('optimist').argv,
    colors = require('chalk'),
    settings = require('../package.json');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  small: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'white',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var TASKS = [
  {
    title: 'peripheral',
    name: 'peripheral',
    summary: 'Start Bluetooth LE peripheral mode tools',
    args: {
      '[options]': ''
    },
    options: {
      '--name|-n': 'Set initial device name'
    },
    module: './tools/peripheral'
  },
  {
    title: 'central',
    name: 'central',
    summary: 'Start Bluetooth LE central mode tools',
    args: {
      '[options]': ''
    },
    options: {
      '--scan|-s': 'Start scanning immediately'
    },
    module: './tools/central'
  }
];

BleTools = {
  PRIVATE_PATH: '.ble-tools',
  _tryBuildingTask: function() {
    if(argv._.length === 0) {
      return false;
    }
    var taskName = argv._[0];

    return this._getTaskWithName(taskName);
  },
  _getTaskWithName: function(name) {
    for(var i = 0; i < TASKS.length; i++) {
      var t = TASKS[i];
      if(t.name === name) {
        return t;
      }
      if(t.alt) {
        for(var j = 0; j < t.alt.length; j++) {
          var alt = t.alt[j];
          if(alt === name) {
            return t;
          }
        }
      }
    }
  },
  printUsage: function(d) {
    var w = function(s) {
      process.stdout.write(s);
    };

    w('\n');

    var rightColumn = 41;
    var dots = '';
    var indent = '';
    var x, arg;

    var taskArgs = d.title;

    for(arg in d.args) {
      taskArgs += ' ' + arg;
    }

    w(taskArgs.green.bold);

    while( (taskArgs + dots).length < rightColumn + 1) {
      dots += '.';
    }

    w(' ' + dots.grey + '  ');

    if(d.summary) {
      w(d.summary.bold);
    }

    for(arg in d.args) {
      if( !d.args[arg] ) continue;

      indent = '';
      w('\n');
      while(indent.length < rightColumn) {
        indent += ' ';
      }
      w( (indent + '    ' + arg + ' ').bold );

      var argDescs = d.args[arg].split('\n');
      var argIndent = indent + '    ';

      for(x=0; x<arg.length + 1; x++) {
        argIndent += ' ';
      }

      for(x=0; x<argDescs.length; x++) {
        if(x===0) {
          w( argDescs[x].bold );
        } else {
          w( '\n' + argIndent + argDescs[x].bold );
        }
      }
    }

    indent = '';
    while(indent.length < d.name.length + 1) {
      indent += ' ';
    }

    var optIndent = indent;
    while(optIndent.length < rightColumn + 4) {
      optIndent += ' ';
    }

    for(var opt in d.options) {
      w('\n');
      dots = '';

      var optLine = indent + '[' + opt + ']  ';

      w(optLine.yellow.bold);

      if(d.options[opt]) {
        while( (dots.length + optLine.length - 2) < rightColumn) {
          dots += '.';
        }
        w(dots.grey + '  ');

        var optDescs = d.options[opt].split('\n');
        for(x=0; x<optDescs.length; x++) {
          if(x===0) {
            w( optDescs[x].bold );
          } else {
            w( '\n' + optIndent + optDescs[x].bold );
          }
        }
      }
    }

    w('\n');
  },
  _printAvailableTasks: function() {
    this._printHeader();
    process.stderr.write('\nUsage: ble-tools task args\n\n=======================\n\n');

    if(process.argv.length > 2) {
      process.stderr.write( (process.argv[2] + ' is not a valid task\n\n').bold.red );
    }

    process.stderr.write('Available tasks: '.bold);
    process.stderr.write('(use --help or -h for more info)\n\n');

    for(var i = 0; i < TASKS.length; i++) {
      var task = TASKS[i];
      if(task.summary) {
        var name = '   ' + task.name + '  ';
        var dots = '';
        while((name + dots).length < 20) {
          dots += '.';
        }
        process.stderr.write(name.green.bold + dots.grey + '  ' + task.summary.bold + '\n');
      }
    }

    process.stderr.write('\n');
    this.processExit(1);
  },
  _printHelpLines: function() {
    this._printHeader();
    process.stderr.write('\n=======================\n');

    for(var i = 0; i < TASKS.length; i++) {
      var task = TASKS[i];
      if(task.summary) {
        this.printUsage(task);
      }
    }

    process.stderr.write('\n');
    this.processExit(1);
  },
  _printHeader: function() {
    var w = function(s) {
      process.stdout.write(s);
    };

//    w('   ___  __   ____  ______          __    \n');
//    w('  / _ )/ /  / __/ /_  __/__  ___  / /__  \n');
//    w(' / _  / /__/ _/    / / / _ \/ _ \/ (_-<  \n');
//    w('/____/____/___/   /_/  \___/\___/_/___/  v' + settings.version + '\n');
    w(" d8b       d8b                                     d8b         \n");
    w(" ?88       88P               d8P                   88P         \n");
    w("  88b     d88             d888888P                d88          \n");
    w("  888888b 888   d8888b      ?88'   d8888b  d8888b 888   .d888b,\n");
    w("  88P `?8b?88  d8b_,dP      88P   d8P' ?88d8P' ?88?88   ?8b,   \n");
    w(" d88,  d88 88b 88b          88b   88b  d8888b  d88 88b    `?8b \n");
    w("d88'`?88P'  88b`?888P'      `?8b  `?8888P'`?8888P'  88b`?888P'  v" + settings.version + '\n');
  },
  run: function() {
    var self = this;

    process.on('exit', function(){
      //self.printVersionWarning();
    });

    if( (argv.version || argv.v) && !argv._.length) {
      return this.version();
    }

    if(argv.help || argv.h) {
      return this._printHelpLines();
    }

    var taskSetting = this._tryBuildingTask();
    if(!taskSetting) {
      return this._printAvailableTasks();
    }
    var taskModule = require(taskSetting.module).ToolsTask;

    var taskInstance = new taskModule();
    taskInstance.run(this);
  },
  fail: function(msg, taskHelp) {
    this.hasFailed = true;
    if(msg) {
      process.stderr.write(msg.error.bold);
      process.stderr.write( (' (v' + settings.version + ')').error.bold + '\n');
    }
    if(taskHelp) {
      for(var i = 0; i < TASKS.length; i++) {
        var task = TASKS[i];
        if(task.name == taskHelp) {
          this.printUsage(task);
          process.stderr.write('\n');
          break;
        }
      }
    }
    process.stderr.write('\n');
    this.processExit(1);
  },
  version: function() {
    process.stderr.write(settings.version + '\n');
  },
  processExit: function(code) {
    process.exit(code);
  }
};

exports.BleTools = BleTools;
