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

export async function createNewCollection({user_id, collection_name}) {
	console.log(user_id, collection_name);
	try {
		flashcards.add({
			user_id,
			name: collection_name,
			flashcards: [],
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
