// React
import React, {useState, useEffect} from "react";
import {StyleSheet, Dimensions, View, ScrollView} from "react-native";

// UI Framework
import {Text, Button, Icon} from "@ui-kitten/components";

// Firebase
import {getCollection} from "../../utils/FirebaseFirestore.js";

// New Flashcard
import NewFlashcard from "../../components/TextEditor/NewFlashcard.js";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default ({theme, user, match}) => {
	const [collection, setCollection] = useState({
		created_at: "",
		flashcards: [],
		name: "",
		user_id: "",
	});

	useEffect(() => {
		getCollection({collection_id: match.params.id})
			.then(value => {
				setCollection(value);
			})
			.catch(error => {
				console.log(error);
			});
	}, []);

	const PlusIcon = props => <Icon {...props} name={"plus-circle"} />;

	return (
		<ScrollView style={styles.collection}>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					marginTop: deviceHeight * 0.01,
					paddingLeft: deviceWidth * 0.05,
					paddingRight: deviceWidth * 0.05,
				}}>
				<Text style={{fontSize: 20, marginTop: deviceHeight * 0.01}}>
					{collection.name}
				</Text>
				<Button
					style={{marginLeft: "auto"}}
					accessoryLeft={PlusIcon}
					onPress={() => {}}>
					Nova
				</Button>
			</View>

			<NewFlashcard />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	collection: {
		height: deviceHeight,
		maxHeight: deviceHeight,
		width: deviceWidth,
		maxWidth: deviceWidth,
	},
});
