const { Plugin } = require('powercord/entities');
const { React } = require('powercord/webpack');

const Settings = require('./components/settings.jsx');
const SnowfallJS = require('./modules/snowfall.js');

module.exports = class Snowfall extends Plugin {
	startPlugin() {
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Snowfall',
			render: Settings,
		});

		this.loadStylesheet('./index.css');

		this.start();
	}

	reload() {
		this.stop();
		this.start();
	}

	stop() {
		SnowfallJS.stop();
	}

	start() {
		this.initSettings = this.updateSettings;
		this.initSettings();

		SnowfallJS.start();
	}

	updateSettings() {
		let type = this.settings.get('type', 0);
		SnowfallJS.updateSettings({
			minSize: this.settings.get('minimum-size', SnowfallJS.options.minSize),
			maxSize: this.settings.get('maximum-size', SnowfallJS.options.maxSize),
			content: this.settings.get('content', SnowfallJS.options.content),
			fadeOut: this.settings.get('fade-out', SnowfallJS.options.fadeOut),
			speed: this.settings.get('speed', SnowfallJS.options.speed),
			maxBlur: this.settings.get('maximum-blur', SnowfallJS.options.maxBlur),
			interval: this.settings.get('interval', SnowfallJS.options.interval),
			color: this.settings.get('color', SnowfallJS.options.color),
			randomSpeed: this.settings.get(
				'random-speed',
				SnowfallJS.options.randomSpeed
			),
			minBlur: this.settings.get(
				'minimum-blur',
				SnowfallJS.options.minimumBlur
			),
			type: type == 0 ? 'solid' : type == 1 ? 'text' : 'image',
		});
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID);

		this.stop();
	}
};
