// React
import React, {useState} from "react";
import {
	StyleSheet,
	Dimensions,
	View,
	TouchableWithoutFeedback,
} from "react-native";

// UI Framework
import {Input, Icon, Button, Modal, Card, Text} from "@ui-kitten/components";

// Router
import {useHistory} from "react-router-dom";

// FirebaseAuth
import {
	AuthWithGoogle,
	AuthWithEmailAndPassword,
} from "../../utils/FirebaseAuth.js";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default ({theme}) => {
	let history = useHistory();

	const [visible, setVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [user, setUser] = useState({
		email: "",
		password: "",
		showPassword: false,
	});

	const EmailIcon = props => <Icon {...props} name={"person"} />;
	const PasswordIcon = props => (
		<TouchableWithoutFeedback
			onPress={() => {
				setUser({...user, showPassword: !user.showPassword});
			}}>
			<Icon {...props} name={!user.showPassword ? "eye" : "eye-off"} />
		</TouchableWithoutFeedback>
	);

	return (
		<View style={styles.container}>
			{/* Error Modal */}
			<Modal
				visible={visible}
				backdropStyle={styles.backdrop}
				onBackdropPress={() => setVisible(false)}>
				<Card disabled={true}>
					<Text style={{marginBottom: 20}}>{errorMessage}</Text>
					<Button onPress={() => setVisible(false)}>OK</Button>
				</Card>
			</Modal>
			<View style={styles.header}>
				<Text
					style={{
						...styles.headerTitle,
						color: theme === "light" ? "#121212" : "#fff",
					}}>
					Bem Vindo(a)
				</Text>
				<Text
					style={{
						...styles.headerSubtitle,
						color: theme === "light" ? "#121212" : "#fff",
					}}>
					Entre com sua conta
				</Text>
			</View>
			<View style={styles.form}>
				<View style={{marginTop: 30, marginBottom: 30}}>
					{/* Email */}
					<Input
						style={styles.input}
						placeholder="Email"
						value={user.email}
						secureTextEntry={false}
						onChangeText={newEmail =>
							setUser({...user, email: newEmail})
						}
						accessoryRight={EmailIcon}
					/>

					{/* Password */}
					<Input
						style={styles.input}
						placeholder="Senha"
						value={user.password}
						secureTextEntry={!user.showPassword}
						onChangeText={newPasswd =>
							setUser({...user, password: newPasswd})
						}
						accessoryRight={PasswordIcon}
					/>

					{/* Forgot Password */}
					<Button
						style={{...styles.forgotButton, marginBottom: 15}}
						appearance="ghost"
						status={"basic"}>
						Esqueceu sua senha?
					</Button>

					{/* Login Button */}
					<Button
						style={styles.loginButton}
						onPress={async () => {
							const ok = await AuthWithEmailAndPassword(
								user.email,
								user.password,
								"signin",
							);
							if (!ok) {
								setErrorMessage(
									"Email e senha incorretos ou Usuário não existe",
								);
								setVisible(true);
							}
						}}>
						Entrar
					</Button>
				</View>

				{/* Login with google */}
				<View style={{marginTop: 20}}>
					<Text
						style={{color: theme === "light" ? "#121212" : "#fff"}}>
						Ou então entre com sua conta Google
					</Text>
					<Button
						onPress={() =>
							AuthWithGoogle()
								.then(() => console.log("Login"))
								.catch(err => console.log(err))
						}
						style={{
							...styles.googleButton,
							marginTop: deviceHeight * 0.05,
						}}
						size={"giant"}
						appearance="ghost"
						accessoryLeft={<Icon name="google" />}></Button>
				</View>
				<Text
					onPress={() => {
						history.push("/auth/register");
					}}
					style={{
						marginTop: deviceHeight * 0.05,
						color: theme === "light" ? "#121212" : "#fff",
					}}>
					Não tem uma conta? Registrar
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 30,
		fontWeight: "bold",
	},
	headerSubtitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	form: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: deviceHeight * 0.2,
	},
	forgotButton: {
		margin: 2,
		marginLeft: "auto",
	},
	loginButton: {
		margin: 2,
		width: deviceWidth * 0.8,
		display: "flex",
		flexDirection: "row",
	},
	googleButton: {
		margin: 2,
	},
	input: {
		margin: 2,
		marginBottom: 15,
		width: deviceWidth * 0.8,
		display: "flex",
		flexDirection: "row",
	},
});
