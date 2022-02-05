module.exports = class Snowfall {
	// declare static variables

	static options = {
		minSize: 5,
		maxSize: 10,
		type: 'solid',
		content: '❄',
		fadeOut: true,
		interval: 1000,
		speed: 1,
		randomSpeed: 1,
		minBlur: 0,
		maxBlur: 1,
		color: '#FFF',
	};

	static __queue = [];
	static __snowfield = document.createElement('div');
	static __isImage = false;
	static __snowflake = null;
	static __timer = null;
	static __hasInit = false;

	static __random(min, max, deviation) {
		if (deviation) {
			deviation *= max;
			max = max + deviation;
			min = max - deviation;
		} else {
			min = min || 0;
		}
		return parseInt(Math.random() * (max - min + 1) + min);
	}

	static start() {
		Snowfall.__start();

		// update settings with initial options
		// commented out because the caller of start() calls it anyways
		//Snowfall.updateSettings(Snowfall.options);

		// register events
		document.onvisibilitychange = () =>
			document['hidden'] ? Snowfall.__stop() : Snowfall.__start();

		Snowfall.__snowfield.ontransitionend = (e) => {
			let snowflake = e.target;
			Snowfall.__snowfield.removeChild(snowflake);
			Snowfall.__queue.push(snowflake);
		};

		Snowfall.__snowfield.className = 'snowfield';
		document.body.appendChild(Snowfall.__snowfield);
	}

	static __start() {
		if (Snowfall.__hasInit) return;
		Snowfall.__hasInit = true;

		Snowfall.__timer = window.setInterval(
			Snowfall.__loop.bind(this),
			Snowfall.options.interval
		);
	}

	static stop() {
		Snowfall.__stop();
		document.onvisibilitychange = null;
		Snowfall.__snowfield.ontransitionend = null;
		Snowfall.__snowfield.innerHTML = null;
		Snowfall.__snowfield.remove();
		Snowfall.__queue = [];
	}

	static __stop() {
		if (!Snowfall.__hasInit) return;
		Snowfall.__hasInit = false;

		window.clearInterval(Snowfall.__timer);
		Snowfall.__timer = null;
	}

	static updateSettings(source) {
		for (var property in source) Snowfall.options[property] = source[property];

		Snowfall.__isImage = Snowfall.options.type == 'image';
		Snowfall.__snowflake = Snowfall.__isImage
			? new Image()
			: document.createElement('div');
		Snowfall.__snowflake.className =
			'snowflake snowflake-' + Snowfall.options.type;
		Snowfall.__snowflake.dataset.type = Snowfall.options.type;

		// for some reason this gets overwritten
		// TODO: find out why
		document.documentElement.style.setProperty(
			'--snow-color',
			Snowfall.options.color
		);
	}

	static __createSnowflake() {
		let snowflake = Snowfall.__snowflake.cloneNode();
		if (Snowfall.options.type == 'solid') {
			return snowflake;
		}

		if (Snowfall.__isImage) {
			snowflake['src'] = Snowfall.options.content;
		} else {
			// innerHTML supports html
			// TODO: may need to escape scripts
			snowflake.innerHTML = Snowfall.options.content;
		}

		return snowflake;
	}

	static __setStyle(element, rules) {
		for (var name in rules) {
			element.style[name] = rules[name];
		}
	}

	static __loop() {
		let snowflake;
		if (Snowfall.__queue.length) {
			snowflake = Snowfall.__queue.shift();
			if (snowflake.dataset.type != Snowfall.options.type)
				snowflake = Snowfall.__createSnowflake();
		} else {
			snowflake = Snowfall.__createSnowflake();
		}

		// style the snowflake

		let opacity = Snowfall.__random(5, 10) / 10;
		let size = Snowfall.__random(
			Snowfall.options.minSize,
			Snowfall.options.maxSize
		);

		// calculate the snowflake's speed

		let bottom = window.innerHeight + size * 2;

		let speed = Snowfall.__random(
			bottom / Snowfall.options.randomSpeed,
			bottom * Snowfall.options.randomSpeed
		);

		let styles = {
			top: `${-2 * size}px`,
			left: `${Snowfall.__random(0, window.innerWidth - size)}px`,
			opacity: opacity,
			transform: 'none',
			transition: `${(speed * 18) / Snowfall.options.speed}ms linear`,
		};

		// skip blur if it's not neede

		if (Snowfall.options.minBlur || Snowfall.options.maxBlur)
			styles.filter = `blur(${Snowfall.__random(
				Snowfall.options.minBlur,
				Snowfall.options.maxBlur
			)}px)`;

		// add movement to the snowflake

		let transformValue = `translate(${Snowfall.__random(
			-100,
			100
		)}px,${bottom}px)`;

		if (Snowfall.options.type != 'solid') {
			transformValue += ` rotate(${Snowfall.__random(
				null,
				window.innerHeight * 0.8,
				1
			)}deg)`;
		}

		switch (Snowfall.options.type) {
			case 'solid':
				styles.width = styles.height = `${size}px`;
				break;
			case 'text':
				styles['font-size'] = `${size}px`;
				break;
			case 'image':
				styles.width = `${size}px`;
				break;
		}

		Snowfall.__setStyle(snowflake, styles);

		// animate the snowflake

		setTimeout(() => {
			Snowfall.__setStyle(snowflake, {
				transform: transformValue,
				opacity: Snowfall.options.fadeOut ? 0 : opacity,
			});
		}, 100);

		Snowfall.__snowfield.appendChild(snowflake);
	}
};
