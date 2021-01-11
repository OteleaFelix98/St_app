
import firebase from "firebase";
require("firebase/firestore");



const firebaseConfig = {
   apiKey: "AIzaSyA7Zznu78fseiqoHcPw9XOQNb0A9H8oCeU",
    authDomain: "stproject-2648d.firebaseapp.com",
    databaseURL: "https://stproject-2648d-default-rtdb.firebaseio.com",
    projectId: "stproject-2648d",
    storageBucket: "stproject-2648d.appspot.com",
    messagingSenderId: "1091372769945",
    appId: "1:1091372769945:web:17810e2a506b9d99df0e08"
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}

 
class FirePost {


    addPost = async ({ text, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);

        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .add({
                    text,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    uploadPhotoAsync = (uri, filename) => {
        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(filename)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    createUser = async user => {
        let remoteUri = null;

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);

            let db = this.firestore.collection("users").doc(this.uid);

            db.set({
                name: user.name,
                email: user.email,
                avatar: null
            });

            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

                db.set({ avatar: remoteUri }, { merge: true });
            }
        } catch (error) {
            alert("Error: ", error);
        }
    };

    signOut = () => {
        firebase.auth().signOut();
    };

    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }

    getPosts = () => {
    return firebase
      .firestore()
      .collection('posts')
      .get()
      .then(function(querySnapshot) {
        let posts = querySnapshot.docs.map(doc => doc.data())
        // console.log(posts)
        return posts
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error)
      })
  }
}


FirePost.shared = new FirePost();
 export const auth=firebase.auth()
  export const db=firebase.firestore()

export default FirePost;

