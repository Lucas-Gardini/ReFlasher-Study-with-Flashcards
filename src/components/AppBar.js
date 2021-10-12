import React from "react";
import {StyleSheet, View} from "react-native";
import {
	Avatar,
	Icon,
	Button,
	Text,
	TopNavigation,
	TopNavigationAction,
} from "@ui-kitten/components";

const lightThemeIcon = props => <Icon {...props} name="sun" />;

const darkThemeIcon = props => <Icon {...props} name="moon" />;

export default ({theme, toggleTheme}) => {
	const [menuVisible, setMenuVisible] = React.useState(false);

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const renderMenuAction = () => (
		<TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
	);

	const renderThemeChanger = () => (
		<Button
			accessoryLeft={theme === "light" ? lightThemeIcon : darkThemeIcon}
			appearance={"ghost"}
			onPress={() => {
				toggleTheme();
			}}></Button>
	);

	const renderTitle = props => (
		<View style={styles.titleContainer}>
			<Avatar
				style={styles.logo}
				source={require("../assets/logo.png")}
			/>
			<Text {...props}>ReFlasher</Text>
		</View>
	);

	return (
		<TopNavigation
			title={renderTitle}
			accessoryRight={renderThemeChanger}
		/>
	);
};

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	logo: {
		marginHorizontal: 16,
	},
});
