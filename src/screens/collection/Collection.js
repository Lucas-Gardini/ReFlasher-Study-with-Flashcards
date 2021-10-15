// React
import React, {useState, useEffect} from "react";
import {StyleSheet, Dimensions, View, ScrollView} from "react-native";

// UI Framework
import {} from "@ui-kitten/components";

// Firebase
import {} from "../../utils/FirebaseFirestore.js";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default ({theme, user, match}) => {
	useEffect(() => {
		console.log(match.params);
	}, []);

	return <ScrollView></ScrollView>;
};

const styles = StyleSheet.create({});
