const { React, getModule } = require('powercord/webpack');
const { toggleSetting, updateSetting } =
	powercord.api.settings._fluxProps('snowfall');
const ColorUtils = getModule(['isValidHex'], false);
const {
	TextInput,
	SliderInput,
	RadioGroup,
	Category,
	ButtonItem,
	SwitchItem,
	ColorPickerInput,
} = require('powercord/components/settings');

module.exports = class SnowfallSettings extends React.Component {
	constructor(props) {
		super(props);
		this.plugin = powercord.pluginManager.get('snowfall');

		this.state = {
			advanced: false,
		};
	}

	render() {
		return (
			<>
				<SwitchItem
					value={this.props.getSetting('fade-out', false)}
					onChange={() => this.__updateSettings('fade-out', null, true)}
					note={'Whether the snowflakes should fade out or not.'}
				>
					Fade out
				</SwitchItem>
				<RadioGroup
					value={0}
					onChange={(e) => this.__updateSettings('type', e.value)}
					value={this.props.getSetting('type', 'solid')}
					options={[
						{
							name: 'Solid: Solid round snowflakes',
							value: 0,
						},
						{
							name: 'Text: Add any text to snowflakes',
							value: 1,
						},
						{
							name: 'Image: Set an image as snowflakes',
							value: 2,
						},
					]}
				>
					Snowflake type
				</RadioGroup>
				<TextInput
					note={
						'The content of snowflakes. Either an image link or text (emojies and HTML tags supported). Only used if snowflake type is set to text.'
					}
					onChange={(content) => this.__updateSettings('content', content)}
					defaultValue={this.props.getSetting('content', '❄')}
				>
					Content of a snowflake
				</TextInput>
				<Category
					name="Advanced settings"
					description="Customize how snowflakes should behave."
					opened={this.state.advanced}
					onChange={() => this.setState({ advanced: !this.state.advanced })}
				>
					<ColorPickerInput
						default={ColorUtils.hex2int('#fff')}
						value={ColorUtils.hex2int(this.props.getSetting(`color`, '000000'))}
						onChange={(value) =>
							this.__updateSettings('color', ColorUtils.int2hex(value))
						}
					/>
					<SliderInput
						note="Set the minimum size of a snowflake."
						minValue={1}
						maxValue={100}
						stickToMarkers
						initialValue={this.props.getSetting('minimum-size', 5)}
						onValueChange={(size) =>
							this.__updateSettings('minimum-size', size)
						}
						markers={[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
					>
						Minimum size of snowflakes
					</SliderInput>
					<SliderInput
						note="Set the maximum size of a snowflake."
						minValue={1}
						maxValue={50}
						stickToMarkers
						initialValue={this.props.getSetting('maximum-size', 10)}
						onValueChange={(size) =>
							this.__updateSettings('maximum-size', size)
						}
						markers={[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
					>
						Maximum size of snowflakes
					</SliderInput>
					<SliderInput
						note="The interval of snowflakes to appear."
						minValue={1}
						maxValue={1000}
						stickToMarkers
						initialValue={this.props.getSetting('interval', 1000)}
						onValueChange={(interval) => {
							this.__updateSettings('interval', interval);
							this.plugin.reload();
						}}
						markers={[
							100, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000,
						]}
					>
						Interval in milliseconds
					</SliderInput>
					<SliderInput
						note="Higher equals faster."
						minValue={0.1}
						maxValue={5}
						stickToMarkers
						initialValue={this.props.getSetting('speed', 1)}
						onValueChange={(speed) => this.__updateSettings('speed', speed)}
						markers={[0.1, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
					>
						Fall down speed
					</SliderInput>
					<SliderInput
						note="Set the randomness in which the snowflakes will fall down."
						minValue={1}
						maxValue={10}
						initialValue={this.props.getSetting('random-speed', 1)}
						onValueChange={(speed) =>
							this.__updateSettings('random-speed', speed)
						}
					>
						Random speed
					</SliderInput>
					<SliderInput
						note="Set the minimum amount of blurryness for snowflakes."
						minValue={0}
						maxValue={5}
						initialValue={this.props.getSetting('minimum-blur', 0)}
						onValueChange={(size) =>
							this.__updateSettings('minimum-blur', size)
						}
					>
						Minimum blur amount
					</SliderInput>
					<SliderInput
						note="Set the maximum amount of blurryness for snowflakes."
						minValue={0}
						maxValue={5}
						initialValue={this.props.getSetting('maximum-blur', 1)}
						onValueChange={(size) =>
							this.__updateSettings('maximum-blur', size)
						}
					>
						Maximum blur amount
					</SliderInput>
				</Category>
				<ButtonItem
					note={
						'Reload the plugin in case changes have not been automatically applied.'
					}
					button="Reload"
					onClick={() => this.plugin.reload()}
				>
					Reload the plugin
				</ButtonItem>
			</>
		);
	}

	__updateSettings(setting, value, toggle) {
		if (toggle) {
			toggleSetting(setting);
		} else {
			updateSetting(setting, value);
		}

		this.plugin.updateSettings();
	}
};
