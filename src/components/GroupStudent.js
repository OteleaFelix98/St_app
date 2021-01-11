import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import colors from "./Colors";
import GroupModal from "./GroupModal";

export default class GroupStudents extends React.Component {
    state = {
        showStudentVisible: false
    };

    toggleStudentModal() {
        this.setState({ showStudentVisible: !this.state.showStudentVisible });
    }

    render() {
        const student = this.props.student;

        const completedCount = student.groups.filter(group => group.completed).length;
        const remainingCount = student.groups.length - completedCount;

        return (
            <View>
                <Modal
                    animationType="slide"
                    visible={this.state.showListVisible}
                    onRequestClose={() => this.toggleGroupModal()}
                >
                    <GroupModal
                        student={student}
                        closeModal={() => this.toggleStudentModal()}
                        updateStudent={this.props.updateStudent}
                    />
                </Modal>
                <TouchableOpacity
                    style={[styles.studentContainer, { backgroundColor: student.color }]}
                    onPress={() => this.toggleStudentModal()}
                >
                    <Text style={styles.studentTitle} numberOfLines={1}>
                        {student.name}
                    </Text>

                    <View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.count}>{remainingCount}</Text>
                            <Text style={styles.subtitle}>Remaining</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.count}>{completedCount}</Text>
                            <Text style={styles.subtitle}>Completed</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    studentContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 12,
        alignItems: "center",
        width: 200
    },
    studentTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 18
    },
    count: {
        fontSize: 48,
        fontWeight: "200",
        color: colors.white
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.white
    }
});
