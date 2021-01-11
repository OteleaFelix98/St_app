import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../components/Colors";
import GroupStudent from "../components/GroupStudent";
import AddStudentModal from "../components/AddStudentModal";
import FireStudents from "../components/FireStudents";

export default class GroupScreen extends React.Component {
    state = {
        addGroupVisible: false,
        students: [],
        user: {},
        loading: true
    };

    componentDidMount() {
        firebase = new FireStudents((error, user) => {
            if (error) {
                return alert("Uh oh, something went wrong");
            }

            firebase.getStudents(students => {
                this.setState({ students, user }, () => {
                    this.setState({ loading: false });
                });
            });

            this.setState({ user });
        });
    }

    componentWillUnmount() {
        firebase.detach();
    }

    toggleAddGroupModal() {
        this.setState({ addGroupVisible: !this.state.addGroupVisible });
    }

    renderStudent = student => {
        return <GroupStudent student={student} updateStudent={this.updateStudent} />;
    };

    addStudent = student => {
        firebase.addStudent({
            name: student.name,
            color: student.color,
            groups: []
        });
    };

    updateStudent = student => {
        firebase.updateStudent(student);
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.blue} />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    visible={this.state.addGroupVisible}
                    onRequestClose={() => this.toggleAddGroupModal()}
                >
                    <AddStudentModal closeModal={() => this.toggleAddGroupModal()} addStudent={this.addStudent} />
                </Modal>

                <View style={{ flexDirection: "row" }}>
                    <View style={styles.divider} />
                    <Text style={styles.title}>
                        Groups <Text style={{ fontWeight: "300", color: colors.blue }}>Page</Text>
                    </Text>
                    <View style={styles.divider} />
                </View>

                <View style={{ marginVertical: 48 }}>
                    <TouchableOpacity style={styles.addStudent} onPress={() => this.toggleAddGroupModal()}>
                        <AntDesign name="plus" size={16} color={colors.blue} />
                    </TouchableOpacity>

                    <Text style={styles.add}>Add Group</Text>
                </View>

                <View style={{ height: 275, paddingLeft: 32 }}>
                    <FlatList
                        data={this.state.students}
                        keyExtractor={item => item.id.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => this.renderStudent(item)}
                        keyboardShouldPersistTaps="always"
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    divider: {
        backgroundColor: colors.lightBlue,
        height: 1,
        flex: 1,
        alignSelf: "center"
    },
    title: {
        fontSize: 38,
        fontWeight: "800",
        color: colors.black,
        paddingHorizontal: 64
    },
    addStudent: {
        borderWidth: 2,
        borderColor: colors.lightBlue,
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    add: {
        color: colors.blue,
        fontWeight: "600",
        fontSize: 14,
        marginTop: 8
    }
});
