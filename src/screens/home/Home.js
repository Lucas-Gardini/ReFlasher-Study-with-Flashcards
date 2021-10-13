// React
import React, {useState} from "react";
import {
	StyleSheet,
	Dimensions,
	View,
	TouchableWithoutFeedback,
} from "react-native";

// UI Framework
import {Input, Icon, Button, Text} from "@ui-kitten/components";

// Router
import {Link} from "react-router-native";

// Firebase
import {SignOut} from "../../utils/FirebaseAuth.js";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default ({theme, user}) => {
	return (
		<View style={styles.container}>
			<Text>Logged in as {user.displayName}</Text>
			<Text>{JSON.stringify(user)}</Text>
			<Button onPress={SignOut}>Sign Out</Button>
		</View>
	);
};

const styles = StyleSheet.create({});
