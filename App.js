// React
import React, {useState, useEffect} from "react";
import {StyleSheet, View, Dimensions} from "react-native";

// UI Framework
import {
	ApplicationProvider,
	IconRegistry,
	Layout,
	Spinner,
} from "@ui-kitten/components";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";

// Router
import {NativeRouter, Route} from "react-router-native";

// Screens
import AuthLogin from "./src/screens/auth/Login.js";
import AuthRegister from "./src/screens/auth/Register.js";
import Home from "./src/screens/home/Home.js";

// Components
import AppBar from "./src/components/AppBar.js";
import AppDrawer from "./src/components/AppDrawer.js";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase
import auth from "@react-native-firebase/auth";

export default () => {
	const [theme, setTheme] = useState("light");
	const [initializing, setInitializing] = useState(true);
	const [drawer, setDrawer] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(async () => {
		const theme = await getTheme();
		setTheme(theme);

		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	// Getting theme from AsyncStorage
	const getTheme = async () => {
		try {
			const theme = await AsyncStorage.getItem("APP_THEME");
			if (theme !== null) {
				return theme;
			} else {
				return "light";
			}
		} catch (e) {
			console.log(e);
		}
	};

	// Handle user state changes
	function onAuthStateChanged(user) {
		setUser(user);
		if (initializing) setInitializing(false);
	}

	const deviceWidth = Dimensions.get("window").width;
	const deviceHeight = Dimensions.get("window").height;

	if (initializing)
		return (
			<ApplicationProvider
				{...eva}
				theme={theme === "light" ? eva.light : eva.dark}>
				<View
					style={{
						width: deviceWidth,
						height: deviceHeight,
						display: "flex",
						alignContent: "center",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Spinner status={"success"} size={"giant"} />
				</View>
			</ApplicationProvider>
		);

	return (
		<NativeRouter>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider
				{...eva}
				theme={theme === "light" ? eva.light : eva.dark}>
				<AppBar
					user={user}
					theme={theme}
					toggleTheme={async () => {
						setTheme(theme === "light" ? "dark" : "light");
						await AsyncStorage.setItem(
							"APP_THEME",
							theme === "light" ? "dark" : "light",
						);
					}}
					toggleDrawer={() => setDrawer(!drawer)}
				/>
				<Layout level="1" style={{height: deviceHeight}}>
					{/* Navigation Drawer */}
					<AppDrawer
						drawer={drawer}
						theme={theme}
						deviceSize={{
							width: deviceWidth,
							height: deviceHeight,
						}}
						user={user}
						logout={() => {
							auth().signOut();
						}}
					/>
					{/* If user is not logged in, show AuthLogin screen */}
					{!user ? (
						<View style={{height: deviceHeight * 0.9}}>
							<Route
								exact
								path="/"
								render={props => (
									<AuthLogin {...props} theme={theme} />
								)}
							/>
							<Route
								exact
								path="/auth/login"
								render={props => (
									<AuthLogin {...props} theme={theme} />
								)}
							/>
							<Route
								exact
								path="/auth/register"
								render={props => (
									<AuthRegister {...props} theme={theme} />
								)}
							/>
						</View>
					) : (
						<View>
							<Route
								exact
								path="/"
								render={props => (
									<Home
										{...props}
										theme={theme}
										user={user}
									/>
								)}
							/>
						</View>
					)}
				</Layout>
			</ApplicationProvider>
		</NativeRouter>
	);
};

const styles = StyleSheet.create({
	text: {
		textAlign: "center",
	},
	likeButton: {
		marginVertical: 16,
	},
});
