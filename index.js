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
		let type = this.settings.get('type');
		SnowfallJS.updateSettings({
			minSize: this.settings.get('minimum-size'),
			maxSize: this.settings.get('maximum-size'),
			content: this.settings.get('content'),
			fadeOut: this.settings.get('fade-out'),
			speed: this.settings.get('speed'),
			randomSpeed: this.settings.get('random-speed'),
			minBlur: this.settings.get('minimum-blur'),
			maxBlur: this.settings.get('maximum-blur'),
			interval: this.settings.get('interval'),
			color: this.settings.get('color'),
			type: type == 0 ? 'solid' : type == 1 ? 'text' : 'image',
		});
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID);

		this.stop();
	}
};
