/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import {
	View,
	Modal,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
} from 'react-native';

import PropTypes from 'prop-types';

import styles from './style';
import BaseComponent from './BaseComponent';

let componentIndex = 0;

const propTypes = {
	data: PropTypes.array,
	onChange: PropTypes.func,
	initValue: PropTypes.string,
	style:  PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	selectStyle:  PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	optionStyle:  PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	optionTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	sectionStyle:  PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	sectionTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	cancelStyle:  PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	cancelTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	overlayStyle:  PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	cancelText: PropTypes.string,
};

const defaultProps = {
	data: [],
	onChange: () => { },
	initValue: 'Select me!',
	style: {},
	selectStyle: {},
	optionStyle: {},
	optionTextStyle: {},
	sectionStyle: {},
	sectionTextStyle: {},
	cancelStyle: {},
	cancelTextStyle: {},
	overlayStyle: {},
	cancelText: 'cancel',
};

export default class ModalPicker extends BaseComponent {
	constructor() {
		super();

		this._bind('onChange', 'open', 'close', 'renderChildren');

		this.state = {
			animationType: 'slide',
			modalVisible: false,
			transparent: false,
			selected: 'please select',
			data: [],
		};

		this.mount = true;
	}

	componentWillUnmount() {
		this.mount = false;
	}

	componentDidMount() {
		if (!this.mount ) return;

		this.setState({ selected: this.props.initValue });
		this.setState({ cancelText: this.props.cancelText });
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!this.mount ) return;
		this.setState({ data: nextProps.data });
	}

	onChange(item) {
		this.props.onChange(item);
		if (!this.mount ) return;
		this.setState({ selected: item.label });
		this.close();
	}

	close() {
		this.setState({
			modalVisible: false,
		});
	}

	open() {
		if (!this.mount ) return;
		this.setState({
			modalVisible: true,
		});
	}

	renderSection(section) {
		return (
			<View
				key={section.key}
				style={[styles.sectionStyle, this.props.sectionStyle]}>
				<Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>
					{section.label}
				</Text>
			</View>
		);
	}

	renderOption(option) {
		return (
			<TouchableOpacity key={option.key} onPress={() => this.onChange(option)}>
				<View
					style={[
						styles.optionStyle,
						this.props.optionStyle,
						{
							flex: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						},
					]}>
					<View style={{ flex: 0.15 }}>
						<Image
							source={option.image}
							resizeMode="stretch"
							style={{ width: 30, height: 16 }}
						/>
					</View>
					<View style={{ flex: 0.7, alignItems: 'center' }}>
						<Text
							style={[
								styles.optionTextStyle,
								this.props.optionTextStyle,
								{ color: '#434343', fontSize: 14 },
							]}>
							{option.label}
						</Text>
					</View>
					<View style={{ flex: 0.15, alignItems: 'flex-end' }}>
						<Text
							style={[
								styles.optionTextStyle,
								this.props.optionTextStyle,
								{ color: 'grey', fontSize: 12 },
							]}>
							{option.dialCode}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	renderOptionList() {
		const options = this.state.data.map(item => {
			if (item.section) {
				return this.renderSection(item);
			}

			return this.renderOption(item);
		});

		return (
			<View
				style={[styles.overlayStyle, this.props.overlayStyle]}
				key={`modalPicker${componentIndex++}`}>
				<View style={styles.optionContainer}>
					<ScrollView keyboardShouldPersistTaps="always">
						<View style={{ paddingHorizontal: 10 }}>{options}</View>
					</ScrollView>
				</View>
				<View style={styles.cancelContainer}>
					<TouchableOpacity onPress={this.close}>
						<View style={[styles.cancelStyle, this.props.cancelStyle]}>
							<Text
								style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>
								{this.props.cancelText}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	renderChildren() {
		if (this.props.children) {
			return this.props.children;
		}
	}

	render() {
		const dp = (
			<Modal
				transparent
				ref={ref => {
					this.modal = ref;
				}}
				visible={this.state.modalVisible}
				onRequestClose={this.close}
				animationType={this.state.animationType}>
				{this.renderOptionList()}
			</Modal>
		);

		return (
			<View style={this.props.style}>
				{dp}

				<TouchableOpacity onPress={this.open}>
					{this.renderChildren()}
				</TouchableOpacity>
			</View>
		);
	}
}

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;
