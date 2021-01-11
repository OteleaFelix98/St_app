import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyA7Zznu78fseiqoHcPw9XOQNb0A9H8oCeU",
    authDomain: "stproject-2648d.firebaseapp.com",
    databaseURL: "https://stproject-2648d-default-rtdb.firebaseio.com",
    projectId: "stproject-2648d",
    storageBucket: "stproject-2648d.appspot.com",
    messagingSenderId: "1091372769945",
    appId: "1:1091372769945:web:98d6a02f7cb258f5df0e08"
};

class Fire {
    constructor(callback) {
        this.init(callback);
    }

    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user);
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch(error => {
                        callback(error);
                    });
            }
        });
    }

    getLists(callback) {
        let ref = this.ref.orderBy("name");

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = [];

            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });

            callback(lists);
        });
    }
  

    addList(list) {
        let ref = this.ref;

        ref.add(list);
    }
     

    updateList(list) {
        let ref = this.ref;

        ref.doc(list.id).update(list);
    }
    
   

    get userId() {
        return firebase.auth().currentUser.uid;
    }

    get ref() {
        return firebase
            .firestore()
            .collection("users")
            .doc(this.userId)
            .collection("lists");
    }
   

    detach() {
        this.unsubscribe();
    }
}

export default Fire;
