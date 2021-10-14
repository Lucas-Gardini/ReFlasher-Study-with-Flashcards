// React
import React, {useState, useEffect} from "react";
import {
	StyleSheet,
	Dimensions,
	View,
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native";

// UI Framework
import {
	Input,
	Icon,
	Button,
	Text,
	IndexPath,
	Select,
	SelectItem,
} from "@ui-kitten/components";

// Router
import {Link} from "react-router-native";

// Firebase
import {getUserCollections} from "../../utils/FirebaseFirestore.js";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default ({theme, user}) => {
	const [query, setQuery] = useState("");
	const [selectedIndexOfOrder, setSelectedIndexOfOrder] = useState(
		new IndexPath(0),
	);
	const [userCollections, setUserCollections] = useState([]);

	useEffect(() => {
		console.log(user.uid);
		getUserCollections({user_id: user.uid}).then(collections => {
			console.log(collections);
			setUserCollections(collections);
		});
	}, []);

	const SearchIcon = props => <Icon {...props} name={"search"} />;
	const ArrowUpIcon = props => <Icon {...props} name={"arrow-up"} />;
	const ArrowDownIcon = props => <Icon {...props} name={"arrow-down"} />;
	const AtIcon = props => <Icon {...props} name={"at"} />;

	return (
		<ScrollView style={styles.home}>
			<Text style={{fontSize: 20, marginTop: deviceHeight * 0.01}}>
				Minhas Coleções
			</Text>

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
});
