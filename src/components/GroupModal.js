import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
    Animated
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import colors from "./Colors";
import { Swipeable } from "react-native-gesture-handler";

export default class GroupModal extends React.Component {
    state = {
        newGroup: ""
    };

    toggleGroupCompleted = index => {
        let student = this.props.student;
        student.groups[index].completed = !student.groups[index].completed;

        this.props.updateStudent(student);
    };

    addGroup = () => {
        let student = this.props.student;

        if (!student.groups.some(group => group.title === this.state.newGroup)) {
            student.groups.push({ title: this.state.newGroup, completed: false });

            this.props.updateStudent(student);
        }

        this.setState({ newStudent: "" });
        Keyboard.dismiss();
    };

    deleteGroup = index => {
        let student = this.props.student;
        student.groups.splice(index, 1);

        this.props.updateStudent(student);
    };

    renderGroup = (group, index) => {
        return (
            <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
                <View style={styles.groupContainer}>
                    <TouchableOpacity onPress={() => this.toggleGroupCompleted(index)}>
                        <Ionicons
                            name={group.completed ? "ios-square" : "ios-square-outline"}
                            size={24}
                            color={colors.gray}
                            style={{ width: 32 }}
                        />
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.group,
                            {
                                textDecorationLine: group.completed ? "line-through" : "none",
                                color: group.completed ? colors.gray : colors.black
                            }
                        ]}
                    >
                        {group.title}
                    </Text>
                </View>
            </Swipeable>
        );
    };

    rightActions = (dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: "clamp"
        });

        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: "clamp"
        });

        return (
            <TouchableOpacity onPress={() => this.deleteGroup(index)}>
                <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
                    <Animated.Text style={{ color: colors.white, fontWeight: "800", transform: [{ scale }] }}>
                        Delete
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    render() {
        const student = this.props.student;

        const taskCount = 30;
        const completedCount = student.groups.filter(groups => groups.completed).length;

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity
                        style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
                        onPress={this.props.closeModal}
                    >
                        <AntDesign name="close" size={24} color={colors.black} />
                    </TouchableOpacity>

                    <View style={[styles.section, styles.header, { borderBottomColor: student.color }]}>
                        <View>
                            <Text style={styles.title}>{student.name}</Text>
                            <Text style={styles.taskCount}>
                                {completedCount} of {taskCount} Students
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
                        <FlatList
                            data={student.groups}
                            renderItem={({ item, index }) => this.renderGroup(item, index)}
                            keyExtractor={item => item.title}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    <View style={[styles.section, styles.footer]}>
                        <TextInput
                            style={[styles.input, { borderColor: student.color }]}
                            onChangeText={text => this.setState({ newStudent: text })}
                            value={this.state.newStudent}
                        />
                        <TouchableOpacity
                            style={[styles.addGroup, { backgroundColor: student.color }]}
                            onPress={() => this.addGroup()}
                        >
                            <AntDesign name="plus" size={16} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    section: {
        alignSelf: "stretch"
    },
    header: {
        justifyContent: "flex-end",
        marginLeft: 64,
        borderBottomWidth: 3,
        paddingTop: 16
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.black
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: "600"
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addGroup: {
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    groupContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 32
    },
    group: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 16
    },
    deleteButton: {
        flex: 1,
        backgroundColor: colors.red,
        justifyContent: "center",
        alignItems: "center",
        width: 80
    }
});
