import firestore from "@react-native-firebase/firestore";

const flashcards = firestore().collection("flashcards");

export async function getUserCollections({user_id}) {
	try {
		const userCollections = await flashcards
			.where("user_id", "==", user_id)
			.get();
		return userCollections.docs.map(doc => doc.data());
	} catch (error) {
		console.log(error);
		return [];
	}
}
