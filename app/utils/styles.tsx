import { StyleSheet } from "react-native"
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: "center"
	},
	radioRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	input: {
		height: 40,
		width: '80%',
		borderColor: 'gray',
		marginBottom: 10,
		textAlign: 'center',
		alignSelf: 'center',
		borderRadius:20,
	},
	title: {
		fontSize: 20,
		marginBottom: 20,
		alignItems: 'center',
		textAlign: 'center',
	},
	text: {
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 20,
	},
	forgotPasswordText: {
		fontWeight: "normal",
		textAlign: "center",
		fontSize: 15,
	},
	loginButton: {
		borderRadius: 30,
		flexDirection: "row",
		width: '80%',
		alignSelf: 'center',
		margin: 10,
		padding: 15,
		justifyContent: "center",
	},
	loginButtonApple: {
		borderRadius: 15,
		flexDirection: "row",
		width: '80%',
		alignSelf: 'center',
		margin: 10,
		padding: 20,
		justifyContent: "center",
	},
	startButton: {
		borderRadius: 100,
		flexDirection: "row",
		width: 100,
		height: 100,
		alignSelf: 'center',
		textAlign: 'center',
		borderBlockColor: 'black',
		marginBlock: 10,
		borderWidth: 10,
		justifyContent: "center",
	},
	startText: {
		fontSize: 15,
	},
	treeButton: {
		height: 90,
		width: 90,
		borderRadius: 50,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	separator: {
		marginVertical: 8,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	app: {
		marginHorizontal: "auto",
		width: 600,
		flexDirection: "row",
		flexWrap: "wrap"
	},
	item: {
		borderRadius: 50,
		flex: 1,
		minWidth: 100,
		maxWidth: 100,
		height: 100,
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
		backgroundColor: "rgba(236, 207, 149, 0.25)",
		borderWidth: 1.5,
		borderColor: "#fff"
	},
	box: {
		height: "50%",
		width: "60%",
		borderRadius: 5,
		marginVertical: 40,
		backgroundColor: '#5e936cff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	surfaceCard: {
		backgroundColor: "#afca98ff",
		marginBottom: 18,
		borderRadius: 18,
	},
	cardContent: {
		padding: 20,
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 4,
		marginTop: 4,
		color: "black",
	},
	cardDescription: {
		fontSize: 15,
		marginBottom: 16,
		color: "black",
	},
	cardDeadline: {
		height: 20,
		fontSize: 15,
		color: "black",
	},
	swipeActionLeft: {
		justifyContent: "center",
		alignItems: "flex-end",
		flex: 1,
		backgroundColor: "red",
		borderRadius: 18,
		marginBottom: 18,
		marginTop: 2,
		paddingRight: 16,

	},
	swipeActionRight: {
		justifyContent: "center",
		alignItems: "flex-start",
		flex: 1,
		backgroundColor: "green",
		borderRadius: 18,
		marginBottom: 18,
		marginTop: 2,
		paddingRight: 16,
	},
	moneyDisplay: {
		backgroundColor: "#fadba9ff",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginLeft: 10,
		marginRight: 10
	},
	streakText: {
		marginLeft: 6,
		marginRight: 2,
		color: "#3f8a1aff",
		fontWeight: "bold",
		fontSize: 14,
	},
	moneyText: {
		marginLeft: 6,
		marginRight: 2,
		color: "#ff9800",
		fontWeight: "bold",
		fontSize: 14,
	},
	header: {
		backgroundColor: '#D1D8BE',
	},
	headerContent: {
		padding: 30,
		alignItems: 'center',
	},
	avatar: {
		width: 130,
		height: 130,
		borderRadius: 63,
		borderWidth: 4,
		borderColor: 'white',
		marginBottom: 10,
	},
	name: {
		fontSize: 22,
		color: '#000000',
		fontWeight: '600',
	},
	userInfo: {
		fontSize: 16,
		color: '#778899',
		fontWeight: '600',
	},
	cardRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginBottom: 4,
	},
	confirmDelete: {
		flexDirection: "row",
		gap: 8,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',

	},
	modalView: {
		margin: 10,
		width: "70%",
		height: "25%",
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 15,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalView2: {
		width: "50%",
		height: "25%",
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	shopContainer: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#E7EFC7",
		margin: 18,
		borderRadius: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4
	},
	card: {
		marginBottom: 16,
		borderRadius: 12,
		backgroundColor: '#E7EFC7',
		elevation: 3,
		padding: 12,
	},
	cardRowAchievements: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	cardTextAchievements: {
		flex: 1,
	},
	cardRowAchievementsTodo: {
		flexDirection: 'row',
	},
	cardTextAchievementsTodo: {
		flex: 1,
		textAlign: "right",
		alignContent: "flex-end",
		justifyContent: "flex-end"
	},
	cardTitleAchievements: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	cardDescriptionAchievements: {
		fontSize: 14,
		color: '#555',
	},
	// box2: {
	// 	height: 50,
	// 	width: 50,
	// 	backgroundColor: '#43266fff',
	// }
})

export default styles