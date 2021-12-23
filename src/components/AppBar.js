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

const hamburgerIcon = props => <Icon {...props} name="menu" />;

export default ({theme, toggleTheme, toggleDrawer, user}) => {
	const [menuVisible, setMenuVisible] = React.useState(false);

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const renderThemeChanger = () => (
		<Button
			accessoryLeft={theme === "light" ? lightThemeIcon : darkThemeIcon}
			appearance={"ghost"}
			onPressIn={toggleTheme}></Button>
	);

	const renderTitle = props => (
		<View style={styles.titleContainer}>
			{user && (
				<Button
					accessoryLeft={hamburgerIcon}
					appearance={"ghost"}
					onPressIn={() => {
						toggleDrawer();
					}}></Button>
			)}
			<Avatar
				style={styles.logo}
				source={require("../assets/logo.png")}
				shape="square"
			/>
			<Text {...props}>ReFlasher</Text>
		</View>
	);

	return (
		<TopNavigation
			title={renderTitle}
			accessoryRight={renderThemeChanger}
			style={{borderBottomWidth: 1, borderBottomColor: "black"}}
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
		transform: [{scale: 0.8}],
	},
});
