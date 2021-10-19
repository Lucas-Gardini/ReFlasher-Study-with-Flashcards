import React from "react";
import {
	SafeAreaView,
	StyleSheet,
	StatusBar,
	KeyboardAvoidingView,
	Animated,
	Platform,
} from "react-native";
import QuillEditor, {QuillToolbar} from "react-native-cn-quill";
export default function App() {
	const _editor = React.createRef();

	return (
		<SafeAreaView style={styles.root}>
			<StatusBar style="auto" />
			<QuillEditor
				style={styles.editor}
				ref={_editor}
				initialHtml="<h1>Quill Editor for react-native</h1>"
			/>

			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				style={{flex: 1}}>
				<Animated.View
					style={[
						{
							marginBottom: 0,
							position: "absolute",
							bottom: 0,
						},
					]}>
					<QuillToolbar
						editor={_editor}
						options="full"
						theme="light"
					/>
				</Animated.View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	title: {
		fontWeight: "bold",
		alignSelf: "center",
		paddingVertical: 10,
	},
	root: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
		backgroundColor: "#eaeaea",
	},
	editor: {
		flex: 1,
		padding: 0,
		borderColor: "gray",
		borderWidth: 1,
		marginHorizontal: 30,
		marginVertical: 5,
		backgroundColor: "white",
		height: 300,
	},
});
