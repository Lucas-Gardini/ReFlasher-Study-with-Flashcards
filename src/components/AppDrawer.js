import React, {useRef, useEffect, useState} from "react";
import {StyleSheet, Animated, View} from "react-native";
import {Avatar, Text, Button, Icon} from "@ui-kitten/components";
import {Drawer} from "react-native-paper";
import {useHistory} from "react-router-dom";

export default ({drawer, theme, deviceSize, user, logout, onRedirect}) => {
	let history = useHistory();

	// Controlling the animation
	const [firstTime, setFirstTime] = useState(true);
	const showOpacityAnim = useRef(new Animated.Value(0)).current;
	const moveLeftAnim = useRef(new Animated.Value(-1000)).current;
	const moveRightAnim = useRef(new Animated.Value(0)).current;

	Animated.timing(showOpacityAnim, {
		toValue: 1,
		duration: 1000,
		useNativeDriver: false,
	}).start();
	const animatedMoveLeft = Animated.timing(moveLeftAnim, {
		toValue: 0,
		duration: 250,
		useNativeDriver: false,
	});
	const animatedMoveRight = Animated.timing(moveRightAnim, {
		toValue: -1000,
		duration: 250,
		useNativeDriver: false,
	});

	useEffect(() => {
		if (firstTime) {
			setFirstTime(false);
		} else {
			animatedMoveLeft.reset();
			animatedMoveRight.reset();
			if (drawer) {
				animatedMoveLeft.start();
			} else {
				animatedMoveRight.start();
			}
		}
	}, [moveLeftAnim, drawer, firstTime]);

	const logoutIcon = props => <Icon {...props} name="log-out" />;

	const redirect = route => {
		onRedirect();
		history.push(route);
	};

	return (
		user &&
		!firstTime && (
			<Animated.View // Special animatable View
				style={{
					position: "absolute",
					top: 0,
					left: drawer ? moveLeftAnim : moveRightAnim,
					opacity: showOpacityAnim,
					zIndex: 9,
					height: deviceSize.height,
					maxHeight: deviceSize.height,
					width: deviceSize.width * 0.7,
					maxWidth: deviceSize.width * 0.7,
					backgroundColor: theme === "light" ? "#fff" : "#222B44",
					borderRightWidth: 1,
					borderRightColor: "black",
				}}>
				<Drawer.Section>
					<View
						style={{
							display: "flex",
							height: deviceSize.height,
						}}>
						<View style={styles.avatarView}>
							<Avatar
								style={styles.avatar}
								size="giant"
								source={{
									uri:
										user.photoURL > 0
											? user.photoURL
											: `https://ui-avatars.com/api/?name=${user.email}`,
								}}
							/>
							<Text style={{textAlign: "center"}}>
								{user.displayName
									? user.displayName
									: user.email}
							</Text>
							<Button
								style={{
									marginTop: "auto",
									marginBottom: 2,
									borderRadius: 0,
									width: "100%",
								}}
								accessoryLeft={logoutIcon}
								appearance={"filled"}
								status={"danger"}
								onPress={() => {
									logout();
								}}>
								Sair
							</Button>
						</View>
						<Drawer.Item
							label={<Text>Início</Text>}
							icon={() => (
								<Icon
									style={{width: 32, height: 32}}
									fill="#8F9BB3"
									name="home"
								/>
							)}
							onPress={() => redirect("/")}
						/>
					</View>
				</Drawer.Section>
			</Animated.View>
		)
	);
};
const styles = StyleSheet.create({
	avatarView: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	avatar: {
		margin: 8,
	},
});
