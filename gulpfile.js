var gulp = require('gulp');
var initGulpTasks = require('react-component-gulp-tasks');

/**
 * Tasks are added by the react-component-gulp-tasks package
 *
 * See https://github.com/JedWatson/react-component-gulp-tasks
 * for documentation.
 *
 * You can also add your own additional gulp tasks if you like.
 */

var taskConfig = {

	component: {
		name: 'Designer',
		dependencies: [
			'classnames',
			'react',
			'react-dom'
		],
		lib: 'lib'
	},

	example: {
		src: 'example/src',
		dist: 'example/dist',
		port: 8002,
		files: [
			'index.html',
			'grid.png',
			'.gitignore'
		],
		scripts: [
			'example.js'
		],
		less: [
			'example.less'
		]
	}

};

initGulpTasks(gulp, taskConfig);
