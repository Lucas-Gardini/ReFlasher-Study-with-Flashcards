// React
import React, {useState, useEffect} from "react";
import {StyleSheet, Dimensions, View, ScrollView} from "react-native";

// UI Framework
import {
	Text,
	Button,
	Icon,
	Modal,
	Card,
	Divider,
	Input,
} from "@ui-kitten/components";

// Firebase
import {getCollection, editCollection} from "../../utils/FirebaseFirestore.js";

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
	const [newFlashcard, setNewFlashcard] = useState({});
	const [addingNewFlashcard, setAddingNewFlashcard] = useState(false);
	const [addingNewFlashcardModal, setAddingNewFlashcardModal] =
		useState(false);

	useEffect(() => {
		queryCollection();
	}, []);

	function queryCollection() {
		getCollection({collection_id: match.params.id})
			.then(value => {
				setCollection(value);
			})
			.catch(error => {
				console.log(error);
			});
	}

	// Card Components
	const Header = ({flashcardTitle}) => (
		<View>
			<View style={{display: "flex", flexDirection: "row"}}>
				<Text
					category="h6"
					style={{
						marginLeft: 10,
						marginTop: 11.5,
						marginBottom: 2.5,
						flex: 1,
						color: "#212B44",
					}}>
					{flashcardTitle > 38
						? flashcardTitle.substring(0, 37) + "..."
						: flashcardTitle}
				</Text>
				<Button
					style={{marginLeft: "auto"}}
					appearance={"ghost"}
					accessoryLeft={EditIcon}></Button>
			</View>
		</View>
	);
	const Footer = () => (
		<View style={styles.footerContainer}>
			<Button style={styles.footerControl} size="small" status="danger">
				Excluir
			</Button>
			<Button style={styles.footerControl} size="small">
				Acessar
			</Button>
		</View>
	);

	const PlusIcon = props => <Icon {...props} name={"plus-circle"} />;
	const CheckIcon = props => <Icon {...props} name={"checkmark-circle-2"} />;
	const CancelIcon = props => <Icon {...props} name={"close-circle"} />;
	const EditIcon = props => <Icon {...props} name={"edit"} />;

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
					onPress={() => {
						setAddingNewFlashcardModal(true);
					}}>
					Novo
				</Button>
			</View>

			{/* New Flashcard Modal */}
			<Modal
				visible={addingNewFlashcardModal}
				backdropStyle={styles.backdrop}>
				<Card disabled={true}>
					<View>
						<Text style={{fontSize: 20}}>
							Adicionando novo flashcard
						</Text>
						<Divider
							style={{
								height: 2.5,
								backgroundColor:
									theme === "light" ? "#000" : "#fff",
								marginBottom: deviceHeight * 0.04,
							}}
						/>
						<Input
							label={"Título ou Pergunta do flashcard"}
							value={addingNewFlashcard.title}
							onChangeText={newTitle =>
								setNewFlashcard({
									...newFlashcard,
									title: newTitle,
								})
							}
						/>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: deviceHeight * 0.02,
							}}>
							<Button
								style={{marginRight: 10}}
								status={"success"}
								accessoryLeft={CheckIcon}
								onPress={() => {
									setAddingNewFlashcardModal(false);
									setAddingNewFlashcard(true);
								}}>
								Confirmar
							</Button>
							<Button
								style={{marginLeft: 10}}
								status={"danger"}
								accessoryLeft={CancelIcon}
								onPress={() => {
									setAddingNewFlashcardModal(false);
									setNewFlashcard({});
								}}>
								Cancelar
							</Button>
						</View>
					</View>
				</Card>
			</Modal>

			{addingNewFlashcard && (
				<NewFlashcard
					theme={theme}
					deviceDimensions={{
						width: deviceWidth,
						height: deviceHeight,
					}}
					saveFlashcard={async flashcard => {
						setCollection({
							...collection,
							flashcards: [
								...collection.flashcards,
								{title: newFlashcard.title, content: flashcard},
							],
						});
						const success = await editCollection({
							collection: {
								created_at: collection.created_at,
								flashcards: [
									...collection.flashcards,
									{
										title: newFlashcard.title,
										content: flashcard,
									},
								],
								user_id: collection.user_id,
								name: collection.name,
							},
							collection_id: match.params.id,
						});

						if (success) {
							setAddingNewFlashcard(false);
							setNewFlashcard({});
						} else {
							alert("Erro");
						}
					}}
					flashcardTitle={newFlashcard.title}
				/>
			)}

			{/* Flashcards */}
			{collection.flashcards.map((flashcard, index) => (
				<Card
					status={theme === "light" ? "primary" : "info"}
					key={index}
					style={{
						...styles.card,
						borderColor: theme === "light" ? "#000" : "#fff",
						borderTopWidth: 0,
						backgroundColor: "#fff",
					}}
					header={<Header flashcardTitle={flashcard.title} />}>
					<Footer />
				</Card>
			))}
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
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	card: {
		flex: 1,
		margin: 2,
		marginBottom: 15,
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	footerControl: {
		marginHorizontal: 2,
	},
});
