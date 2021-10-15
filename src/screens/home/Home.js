// React
import React, {useState, useEffect} from "react";
import {StyleSheet, Dimensions, View, ScrollView} from "react-native";

// UI Framework
import {
	Input,
	Icon,
	Button,
	Text,
	IndexPath,
	Select,
	SelectItem,
	Modal,
	Card,
	Spinner,
} from "@ui-kitten/components";
import {Divider} from "react-native-paper";

// Router
import {useHistory} from "react-router-dom";

// Firebase
import {
	getUserCollections,
	createNewCollection,
	deleteCollection,
} from "../../utils/FirebaseFirestore.js";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default ({theme, user}) => {
	let history = useHistory();

	const [query, setQuery] = useState("");
	const [selectedIndexOfOrder, setSelectedIndexOfOrder] = useState(
		new IndexPath(0),
	);
	const [userCollections, setUserCollections] = useState([]);
	const [newCollectionModal, setNewCollectionModal] = useState(false);
	const [newCollectionName, setNewCollectionName] = useState("");
	const [formValidated, setFormValidated] = useState({
		validated: false,
		correct: false,
	});
	const [loadingCollection, setLoadingCollection] = useState(false);
	const [deletingCollectionModal, setDeletingCollectionModal] =
		useState(false);
	const [deletingCollection, setDeletingCollection] = useState({
		name: "",
		id: "",
		flashcardsQuantity: 0,
	});

	useEffect(() => {
		getUserCollections({user_id: user.uid}).then(collections => {
			setUserCollections(collections);
		});
	}, []);

	const SearchIcon = props => <Icon {...props} name={"search"} />;
	const ArrowUpIcon = props => <Icon {...props} name={"arrow-up"} />;
	const ArrowDownIcon = props => <Icon {...props} name={"arrow-down"} />;
	const AtIcon = props => <Icon {...props} name={"at"} />;
	const PlusIcon = props => <Icon {...props} name={"plus-circle"} />;
	const CheckIcon = props => <Icon {...props} name={"checkmark-circle-2"} />;
	const CancelIcon = props => <Icon {...props} name={"close-circle"} />;
	const BookIcon = props => <Icon {...props} name={"book"} />;

	// Card Components
	const Header = ({name, flashcardsLength}) => (
		<View>
			<Text category="h6" style={{margin: 10, marginBottom: 2.5}}>
				{name}
			</Text>
			<Text category="s1" style={{margin: 10, marginTop: 2.5}}>
				Quantidade de Flashcards: {flashcardsLength}
			</Text>
		</View>
	);
	const Footer = ({name, collectionID, flashcardsLength}) => (
		<View style={styles.footerContainer}>
			<Button
				style={styles.footerControl}
				size="small"
				status="danger"
				onPress={() => {
					setDeletingCollectionModal(true);
					setDeletingCollection({
						name,
						id: collectionID,
						flashcardsQuantity: flashcardsLength,
					});
				}}>
				Excluir
			</Button>
			<Button
				style={styles.footerControl}
				size="small"
				onPress={() => {
					history.push(`/collection/${collectionID}`);
				}}>
				Acessar
			</Button>
		</View>
	);

	return (
		<ScrollView style={styles.home}>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					marginTop: deviceHeight * 0.01,
				}}>
				<Text style={{fontSize: 20, marginTop: deviceHeight * 0.01}}>
					Minhas Coleções
				</Text>
				<Button
					style={{marginLeft: "auto"}}
					accessoryLeft={PlusIcon}
					onPress={() => {
						setNewCollectionModal(true);
					}}>
					Nova
				</Button>
			</View>

			{/* New Collection Modal */}
			<Modal visible={newCollectionModal} backdropStyle={styles.backdrop}>
				<Card disabled={true}>
					{loadingCollection ? (
						<Spinner size="giant" />
					) : (
						<View>
							<Text style={{fontSize: 20}}>
								Criando nova coleção
							</Text>
							<Divider />
							<Input
								style={{
									marginTop: deviceHeight * 0.02,
									marginBottom: deviceHeight * 0.05,
								}}
								label={"Novo Nome"}
								placeholder="Digite aqui..."
								value={newCollectionName}
								secureTextEntry={false}
								onChangeText={newCollectioNName =>
									setNewCollectionName(newCollectioNName)
								}
								accessoryLeft={BookIcon}
								editable={true}
								status={
									formValidated.validated
										? formValidated.correct
											? "success"
											: "danger"
										: "basic"
								}
								caption={
									formValidated.validated
										? formValidated.correct
											? ""
											: "Preencha este campo!"
										: ""
								}
							/>
							<View
								style={{display: "flex", flexDirection: "row"}}>
								<Button
									style={{marginRight: 10}}
									status={"success"}
									accessoryLeft={CheckIcon}
									onPress={async () => {
										if (newCollectionName.length > 0) {
											setLoadingCollection(true);
											setFormValidated({
												validated: true,
												correct: true,
											});

											const success =
												await createNewCollection({
													user_id: user.uid,
													collection_name:
														newCollectionName,
												});
											if (success) {
												setNewCollectionName("");
												setFormValidated({
													validated: false,
													correct: false,
												});
												getUserCollections({
													user_id: user.uid,
												}).then(collections => {
													setUserCollections(
														collections,
													);
													setLoadingCollection(false);
													setNewCollectionModal(
														false,
													);
												});
											} else {
												setNewCollectionModal(true);
											}
										} else {
											setFormValidated({
												validated: true,
												correct: false,
											});
										}
									}}>
									Confirmar
								</Button>
								<Button
									style={{marginLeft: 10}}
									status={"danger"}
									accessoryLeft={CancelIcon}
									onPress={() => {
										setNewCollectionModal(false);
										setNewCollectionName("");
										setFormValidated({
											validated: false,
											correct: false,
										});
									}}>
									Cancelar
								</Button>
							</View>
						</View>
					)}
				</Card>
			</Modal>

			{/* Deleting Collection Modal */}
			<Modal
				visible={deletingCollectionModal}
				backdropStyle={styles.backdrop}>
				<Card disabled={true}>
					{loadingCollection ? (
						<Spinner size="giant" />
					) : (
						<View>
							<Text style={{fontSize: 20}}>
								Excluindo coleção
							</Text>
							<Divider
								style={{
									height: 2.5,
									backgroundColor:
										theme === "light" ? "#000" : "#fff",
									marginTop: deviceHeight * 0.001,
									marginBottom: deviceHeight * 0.03,
								}}
							/>
							<Text
								style={{
									fontSize: 16,
									marginBottom: deviceHeight * 0.01,
								}}>
								Deseja realmente excluir a coleção:{" "}
								{deletingCollection.name}?
							</Text>
							<Text style={{fontSize: 14}}>
								A coleção conta atualmente com{" "}
								{deletingCollection.flashcardsQuantity}{" "}
								flashcards.
							</Text>
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
									onPress={async () => {
										const success = await deleteCollection({
											collection_id:
												deletingCollection.id,
										});
										if (success) {
											getUserCollections({
												user_id: user.uid,
											}).then(collections => {
												setUserCollections(collections);
												setLoadingCollection(false);
												setDeletingCollectionModal(
													false,
												);
											});
										} else {
											setDeletingCollectionModal(true);
										}
									}}>
									Confirmar
								</Button>
								<Button
									style={{marginLeft: 10}}
									status={"danger"}
									accessoryLeft={CancelIcon}
									onPress={() => {
										setDeletingCollection({
											flashcardsQuantity: 0,
											name: "",
											id: "",
										});
										setDeletingCollectionModal(false);
									}}>
									Cancelar
								</Button>
							</View>
						</View>
					)}
				</Card>
			</Modal>

			{/* Search Area */}
			<View style={styles.searchArea}>
				<Input
					style={styles.input}
					label={"Pesquisar"}
					placeholder="Procurar..."
					value={query}
					secureTextEntry={false}
					onChangeText={newQuery => setQuery(newQuery)}
					accessoryLeft={SearchIcon}
					editable={true}
				/>
				<Select
					style={styles.select}
					selectedIndex={selectedIndexOfOrder}
					onSelect={index => setSelectedIndexOfOrder(index)}
					label={"Ordenar"}>
					<SelectItem accessoryLeft={ArrowDownIcon} />
					<SelectItem accessoryLeft={ArrowUpIcon} />
					<SelectItem accessoryLeft={AtIcon} />
				</Select>
				<Button
					style={styles.search}
					accessoryLeft={SearchIcon}></Button>
			</View>

			<Divider
				style={{
					height: 2.5,
					backgroundColor: theme === "light" ? "#000" : "#fff",
					marginBottom: deviceHeight * 0.04,
				}}
			/>
			{/* Collections Area */}
			{userCollections.map((collection, index) => (
				<Card
					status={theme === "light" ? "primary" : "info"}
					key={index}
					style={{
						...styles.card,
						borderColor: theme === "light" ? "#000" : "#fff",
						borderTopWidth: 0,
					}}
					header={
						<Header
							name={collection.name}
							flashcardsLength={collection.flashcards.length}
						/>
					}>
					<Footer
						name={collection.name}
						flashcardsLength={collection.flashcards.length}
						collectionID={collection.id}
					/>
				</Card>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	home: {
		height: deviceHeight,
		maxHeight: deviceHeight,
		width: deviceWidth,
		maxWidth: deviceWidth,
		paddingLeft: deviceWidth * 0.05,
		paddingRight: deviceWidth * 0.05,
	},
	searchArea: {
		marginTop: deviceHeight * 0.01,
		marginBottom: deviceHeight * 0.05,
		width: deviceWidth * 0.9,
		height: deviceHeight * 0.1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	input: {
		width: "45%",
		maxHeight: deviceHeight * 0.05,
	},
	select: {
		width: "30%",
		maxHeight: deviceHeight * 0.05,
	},
	search: {
		width: "15%",
		height: deviceHeight * 0.001,
		marginTop: "auto",
	},
	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	card: {
		flex: 1,
		margin: 2,
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	footerControl: {
		marginHorizontal: 2,
	},
});
