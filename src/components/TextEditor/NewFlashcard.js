import React, {useState} from "react";
import {
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	View,
} from "react-native";
import {FAB} from "react-native-paper";
import {Icon, Modal, Card, Divider, Text, Button} from "@ui-kitten/components";
import QuillEditor, {QuillToolbar} from "react-native-cn-quill";
export default function ({
	theme,
	deviceDimensions,
	flashcardTitle,
	saveFlashcard,
}) {
	const _editor = React.createRef();
	const imageIcon = require("../../assets/image.png");
	const [savingFlashcard, setSavingFlashcard] = useState(false);

	const QuillToolbarCustomHandler = (name, value) => {
		if (name === "image") {
			_editor.current.insertImage();
		}
	};

	const CheckIcon = props => <Icon {...props} name={"checkmark-circle-2"} />;
	const CancelIcon = props => <Icon {...props} name={"close-circle"} />;

	return (
		<KeyboardAvoidingView
			style={styles.root}
			behavior={Platform.OS == "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
			enabled={true}>
			<SafeAreaView
				style={{flex: 1, height: deviceDimensions.height - 100}}>
				<QuillToolbar
					editor={_editor}
					options={[
						["bold", "italic", "underline"],
						[{header: 1}, {header: 2}],
						[{align: []}],
						[
							{
								color: [
									"#fff",
									"#000000",
									"#e60000",
									"#ff9900",
									"yellow",
									"green",
									"blue",
									"brown",
									"pink",
								],
							},
							{background: []},
						],
						["image"],
					]}
					theme={"light"}
					custom={{
						handler: QuillToolbarCustomHandler,
						actions: ["image"],
						icons: {image: imageIcon},
					}}
				/>
				<QuillEditor
					style={{
						...styles.editor,
						marginTop: 50,
					}}
					ref={_editor}
					theme={theme === "light" ? "snow" : "bubble"}
					initialHtml="<h1>Insira o conteúdo aqui...</h1>"
				/>

				<FAB
					style={{
						...styles.fab,
						backgroundColor: "#3266FF",
					}}
					small
					icon={() => <Icon fill="#fff" name="checkmark" />}
					onPress={() => setSavingFlashcard(true)}
				/>

				{/* Saving Flashcard Modal */}
				<Modal
					visible={savingFlashcard}
					backdropStyle={styles.backdrop}>
					<Card disabled={true}>
						<View>
							<Text style={{fontSize: 20}}>
								Deseja realmente salvar o flashcard:{" "}
								{flashcardTitle}?
							</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									marginTop: deviceDimensions.height * 0.02,
								}}>
								<Button
									style={{marginRight: 10}}
									status={"success"}
									accessoryLeft={CheckIcon}
									onPress={async () => {
										saveFlashcard(
											await _editor.current.getHtml(),
										);
									}}>
									Confirmar
								</Button>
								<Button
									style={{marginLeft: 10}}
									status={"danger"}
									accessoryLeft={CancelIcon}
									onPress={() => {
										setSavingFlashcard(false);
									}}>
									Cancelar
								</Button>
							</View>
						</View>
					</Card>
				</Modal>
			</SafeAreaView>
		</KeyboardAvoidingView>
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
		marginTop: 10,
		backgroundColor: "#eaeaea",
	},
	editor: {
		flex: 1,
		padding: 0,
		borderColor: "gray",
		borderWidth: 1,
		// marginHorizontal: 30,
		// marginVertical: 5,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "stretch",
	},
	fab: {
		position: "absolute",
		margin: 16,
		right: 0,
		bottom: 40,
	},
	// icon: {
	// 	width: 32,
	// 	height: 32,
	// },
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});
