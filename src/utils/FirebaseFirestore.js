import firestore from "@react-native-firebase/firestore";

const flashcards = firestore().collection("flashcards");

// Get all user collections
export async function getUserCollections({user_id}) {
	try {
		const userCollections = await flashcards
			.where("user_id", "==", user_id)
			.get();
		let collections = userCollections.docs.map(doc => {
			return {
				id: doc.id,
				...doc.data(),
			};
		});

		// Invert array
		collections = collections.reverse();

		return collections;
	} catch (error) {
		console.log(error);
		return [];
	}
}

// Get all flashcards in a collection, and info about the collection
export async function getCollection({collection_id}) {
	try {
		const collection = flashcards.doc(collection_id).get();
		return collection.data();
	} catch (error) {
		return false;
	}
}

// Create a new collection
export async function createNewCollection({user_id, collection_name}) {
	console.log(user_id, collection_name);
	try {
		flashcards.add({
			user_id,
			name: collection_name,
			flashcards: [],
			created_at: new Date(),
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

// Delete a collection
export async function deleteCollection({collection_id}) {
	try {
		flashcards.doc(collection_id).delete();
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

// Edit a collection
export async function editCollection({collection_id, collection}) {
	try {
		flashcards.doc(collection_id).set(collection);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
