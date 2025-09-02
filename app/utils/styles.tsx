import { StyleSheet } from "react-native"
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#faf8e7ff',
		// alignItems: "center",
		justifyContent:"center"
	},
	input: {
		height: 40,
		width: '80%',
		borderColor: 'gray',
		// borderWidth: 1,
		marginBottom: 10,
		textAlign: 'center',
		alignSelf: 'center',
		backgroundColor: '#E7EFC7',

		// borderRadius: 10,
		// alignSelf: 'center',
		// 		padding: 10,

		// // borderWidth: 1,
		// borderRadius: 20,
		// // padding: 10,
		// // justifyContent: 'center',
		// textAlign: 'center',
		// // alignItems: 'center',
		// // fontSize: 12,
		// backgroundColor: '#9fdfa7ff',
		// shadowColor: "#000",
		// shadowOffset:{ width: 0, height: 2 },
		// shadowOpacity: 0.5,
		// shadowRadius: 8,
		//   paddingVertical: 12,        // își păstrează înălțimea dorită

		// elevation: 4
	},
  	title: {
		fontSize: 20,
		marginBottom: 20,
	  	alignItems: 'center',
		textAlign: 'center',
	},
  	text: {
		fontWeight:"bold",
		textAlign:"center",
			fontSize: 20,
		color: "#003829",
	},
	forgotPasswordText: {
		fontWeight:"normal",
		textAlign:"center",
		fontSize: 15,
		color: "#003829",
	},
	colors: {
		backgroundColor: '#e7fff9',
		shadowColor: '#007052',
		tintColor: '#003829',
		borderColor: '#004331',
	},

		// https://colorhunt.co/
	loginButton: {
		borderRadius: 30,
		flexDirection: "row",
		width: '80%',
		alignSelf: 'center',
		margin: 10,
		padding: 15,
		justifyContent:"center",
		backgroundColor: '#537D5D',
	
	},
	loginButtonApple: {
		borderRadius: 15,
		flexDirection: "row",
		width: '80%',
		alignSelf: 'center',
		margin: 10,
		padding: 20,
		justifyContent:"center",
		backgroundColor: '#5E936C',
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
		backgroundColor: '#5E936C',
	},
	startText: {
		color: 'white',
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
		borderBottomColor: '#471515ff',
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
    	height: 200,
    	width: 200,
    	borderRadius: 5,
    	marginVertical: 40,
    	backgroundColor: '#489889ff',
    	alignItems: 'center',
    	justifyContent: 'center',
	},
	surfaceCard: {
		backgroundColor: "#E7EFC7",
		marginBottom: 18,
		borderRadius: 18,
		// shadowColor: "#000",
		// shadowOffset:{ width: 0, height: 2 },
		// shadowOpacity: 0.08,
		// shadowRadius: 8,
		elevation: 4
	},
	cardContent: {
    	padding: 20,
	},
  	cardTitle: {
    	fontSize: 20,
    	fontWeight: "bold",
    	marginBottom: 4,
    	color: "black",
  	},
  	cardDescription: {
    	fontSize: 15,
    	marginBottom: 16,
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
		paddingRight:16,
	  
	},
	swipeActionRight: {
		justifyContent: "center",
		alignItems: "flex-start",
		flex: 1,
		backgroundColor: "green",
		borderRadius: 18,
		marginBottom: 18,
		marginTop: 2,
		paddingRight:16,
	},
	frequencyBadge: {
    	backgroundColor: "#ede7f6",
    	borderRadius: 12,
    	paddingHorizontal: 12,
    	paddingVertical: 4,
  },
})

export default styles