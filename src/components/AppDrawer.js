import React, {useRef, useEffect, useState} from "react";
import {StyleSheet, Animated, View} from "react-native";
import {Avatar, Text, Button, Icon} from "@ui-kitten/components";
import {Drawer} from "react-native-paper";

export default ({drawer, theme, deviceSize, user, logout}) => {
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
					width: deviceSize.width * 0.5,
					maxWidth: deviceSize.width * 0.5,
					backgroundColor: theme === "light" ? "#fff" : "#222B44",
					borderRightWidth: 1,
					borderRightColor: "black",
				}}>
				<Drawer.Section>
					<View
						style={{
							display: "flex",
							height: deviceSize.height * 0.89,
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
						</View>
						<Drawer.Item
							label="First Item"
							onPress={() => setDrawer("first")}
						/>
						<Drawer.Item
							label="Second Item"
							onPress={() => setDrawer("second")}
						/>

						{/* Logout */}
						<Drawer.Item
							label="Logout"
							onPress={() => setDrawer("second")}
						/>
						<Button
							style={{
								marginTop: "auto",
								borderRadius: 0,
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
	},
	avatar: {
		margin: 8,
	},
});
