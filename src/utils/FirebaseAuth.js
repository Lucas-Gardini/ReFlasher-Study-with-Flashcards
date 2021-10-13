// Firebase
import auth from "@react-native-firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";

// Configuring google auth
GoogleSignin.configure({
	webClientId:
		"386864383726-nn5621v2atmlng9ch6mhalp3u9t8edls.apps.googleusercontent.com",
});

export async function AuthWithGoogle() {
	// Get the users ID token
	const {idToken} = await GoogleSignin.signIn();

	// Create a Google credential with the token
	const googleCredential = auth.GoogleAuthProvider.credential(idToken);

	// Sign-in the user with the credential and save on Async Storage
	auth()
		.signInWithCredential(googleCredential)
		.then(user => {
			console.log("User signed in with Google", user);
		})
		.catch(error => {
			console.log(error);
		});
}

export async function AuthWithEmailAndPassword(email, password, mode) {
	return new Promise((resolve, reject) => {
		if (mode === "signup") {
			auth()
				.createUserWithEmailAndPassword(email, password)
				.then(user => {
					console.log("User signed up with email and password", user);
				})
				.catch(error => {
					console.log(error);
					resolve(false);
				});
		} else if (mode === "signin") {
			auth()
				.signInWithEmailAndPassword(email, password)
				.then(user => {
					console.log("User signed in with email and password", user);
				})
				.catch(error => {
					console.log(error);
					resolve(false);
				});
		}
	});
}

export async function SignOut() {
	await auth().signOut();
}
