// React
import React, {useState, useEffect} from "react";
import {StyleSheet} from "react-native";

// UI Framework
import {ApplicationProvider, IconRegistry, Layout} from "@ui-kitten/components";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";

// Router
import {NativeRouter, Route} from "react-router-native";

// Screens
import AuthLogin from "./src/screens/auth/Login.js";

// Components
import AppBar from "./src/components/AppBar.js";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

export default () => {
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

	const [theme, setTheme] = useState("light");

	useEffect(async () => {
		const theme = await getTheme();
		setTheme(theme);
	}, []);

	return (
		<NativeRouter>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider
				{...eva}
				theme={theme === "light" ? eva.light : eva.dark}>
				<Layout style={styles.container} level="1">
					<AppBar
						theme={theme}
						toggleTheme={async () => {
							setTheme(theme === "light" ? "dark" : "light");
							await AsyncStorage.setItem(
								"APP_THEME",
								theme === "light" ? "dark" : "light",
							);
						}}
					/>

					{/* <Route exact path="/" component={Home} /> */}
					{/* <Route exact path="/auth/login" component={AuthLogin} /> */}
					<Route
						exact
						path="/"
						render={props => <AuthLogin {...props} theme={theme} />}
					/>
				</Layout>
			</ApplicationProvider>
		</NativeRouter>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		textAlign: "center",
	},
	likeButton: {
		marginVertical: 16,
	},
});
