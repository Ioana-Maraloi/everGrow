import { View, Text, Dimensions, ScrollView } from "react-native"
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../../utils/authContext"
import styles from '../../utils/styles'
import { Colors } from '../../utils/colors'
import { FIREBASE_APP } from "../../../firebaseConfig"
import { LineChart, PieChart, ContributionGraph, } from "react-native-chart-kit"
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore'
interface commitData {
    date: string,
    count: number
}
export default function Stats() {
    const width = Dimensions.get("window").width

    const db = getFirestore(FIREBASE_APP)
    const authState = useContext(AuthContext)

          
    const { theme } = useContext(AuthContext)
    const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark"
            
    
    const [totalTreesPlanted, setTotalTreesPlanted] = useState(0)
    const [treesDead, setTreesDead] = useState(0)
    const [totalFocusedTime, setTotalFocusedTime] = useState(0)

    const [past7Days, setpast7Days] = useState<string[]>([])
    const [timeFocusedPast7Days, setTimeFocusedPast7Days] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
    const [past90DaysCommits, setPast90DaysCommits] = useState<commitData[]>([])
    const data = [
        {
            name: "trees planted",
            population: totalTreesPlanted,
            color: "rgb(45, 79, 43)",
            legendFontColor: "#4f4e4eff"
        },
        {
            name: "dead trees",
            population: treesDead,
            color: "rgb(75, 53, 42)",
            legendFontColor: "#4f4e4eff",
        }
    ]
    const data7Days = {
        labels: past7Days,
        datasets: [
            {
                data: timeFocusedPast7Days,
                color: (opacity = 1) => "#000000ff",
                strokeWidth: 2
            }
        ],
    }
    const commitsData = past90DaysCommits

    function getYesterday(dateString: string): string {
        const [day, month, year] = dateString.split("-").map(Number)

        const today = new Date(year, month - 1, day)
        today.setDate(today.getDate() - 1)

        const yDay = today.getDate().toString().padStart(2, "0")
        const yMonth = (today.getMonth() + 1).toString().padStart(2, "0")
        const yYear = today.getFullYear()

        return `${yDay}-${yMonth}-${yYear}`
    }
    const setTotalTrees = async () => {
        try {
            const statsRef = doc(db, 'users', authState.displayName, 'trees', 'stats')
            const docSnap = await getDoc(statsRef)
            if (docSnap.exists()) {
                setTotalTreesPlanted(docSnap.data().treesPlanted)
                setTreesDead(docSnap.data().treesDead)
                setTotalFocusedTime(docSnap.data().totalFocusedTime)
            }
            const dateToday = new Date().getDate()
            const monthToday = new Date().getMonth() + 1
            const yearToday = new Date().getFullYear()
            const todayString = dateToday.toString().padStart(2, "0") + "-" +
                monthToday.toString().padStart(2, "0") + "-" +
                yearToday.toString().padStart(2, "0")

            const todayRef = doc(db, "users", authState.displayName, "trees",
                "stats", todayString, "stats")
            const todaySnap = await getDoc(todayRef)
            let values: number[] = []
            let days: string[] = []
            if (todaySnap.exists()) {
                values.push(todaySnap.data().timeFocusedToday)
            } else {
                values.push(0)
            }
            days.push(todayString)
            let dayString = todayString
            for (let i: number = 0; i < 6; i++) {
                let yesterdayString = getYesterday(dayString)
                const yesterdayRef = doc(db, "users", authState.displayName,
                    "trees", "stats", yesterdayString, "statsToday")
                const yesterdaySnap = await getDoc(yesterdayRef)
                // console.log(yesterdayString)
                if (yesterdaySnap.exists()) {
                    values.push(yesterdaySnap.data().timeFocusedToday)
                } else {
                    values.push(0)
                }
                days.push(yesterdayString)
                dayString = yesterdayString

            }
            values.reverse()
            days.reverse()
            setTimeFocusedPast7Days(values)
            // setpast7Days(days)
            setpast7Days(days.map(d => d.slice(0, 5)))

            const todayStringRev = yearToday.toString().padStart(2, "0") + "-"
                + monthToday.toString().padStart(2, "0") + "-" +
                dateToday.toString().padStart(2, "0")
            const todayRefCommits = doc(db, "users", authState.displayName,
                "tasks", "stats", todayString, "statsToday")
            const todayCommitsSnap = await getDoc(todayRefCommits)
            let countToday = 0
            if (todayCommitsSnap.exists()) {
                countToday = todayCommitsSnap.data().tasksCompleted

            }
            let past90DaysCommitsVect: commitData[] = []
            past90DaysCommitsVect.push({
                date: todayStringRev,
                count: countToday
            })
            let dayStringCommit = todayString
            for (let i: number = 0; i < 30; i++) {
                let yesterdayStringCommit = getYesterday(dayStringCommit)
                const yesterdayRefsCommit = doc(db, "users", authState.displayName,
                    "tasks", "stats", yesterdayStringCommit, "statsToday")
                const yesterdayCommitsSnap = await getDoc(yesterdayRefsCommit)
                let count = 0
                if (yesterdayCommitsSnap.exists()) {
                    count = yesterdayCommitsSnap.data().tasksCompleted
                }
                const day = yesterdayStringCommit.split("-")[0]
                const month = yesterdayStringCommit.split("-")[1]
                const year = yesterdayStringCommit.split("-")[2]
                const yesterdayCommitReverseString = year + "-" + month + "-" + day
                past90DaysCommitsVect.push({
                    date: yesterdayCommitReverseString,
                    count: count
                })
                dayStringCommit = yesterdayStringCommit
            }
            setPast90DaysCommits(past90DaysCommitsVect)
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        try {
            const listen = onSnapshot(doc(db, "users", authState.displayName,
                "trees", "stats"), (doc) => {
                setTotalTrees()
            })
            const listen2 = onSnapshot(doc(db, "users", authState.displayName,
                "tasks", "stats"), (doc) => {
                setTotalTrees()
            })
            return () => {
                listen()
                listen2()
            }
        }
        catch (error) {
            console.log(error)
        }
    })
    const chartConfig = {
        backgroundGradientFrom: "#E7EFC7",
        backgroundGradientFromOpacity: 0.5,
        backgroundGradientTo: "#E7EFC7",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        // barPercentage: 0.5,
        // useShadowColorFromDataset: false // optional
    }
    const chartConfigLine = {
        backgroundGradientFromOpacity: 0.5,
        backgroundGradientToOpacity: 0.5,
        strokeWidth: 2,
        backgroundGradientFrom: "#E7EFC7",
        backgroundGradientTo: "#E7EFC7",
        color: (opacity = 1) => `rgba(112, 138, 88, ${opacity})` // optional
    }

    const chartConfig3 = {
        backgroundGradientFrom: "#E7EFC7",
        backgroundGradientTo: "#E7EFC7",

        backgroundGradientFromOpacity: 0.5,
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(45, 79, 43, ${opacity})`,
        style: {
            borderRadius: 16
        },
    }
    return (
        <ScrollView style={{
                backgroundColor: Colors[currentTheme].backgroundColor,
        }}>
            <Text style={{
                marginVertical: 10,
                textAlign: "center",
                fontSize: 16,
                color:  Colors[currentTheme].colorTitleTab
            }}>Tree status overview</Text>
            <PieChart
                data={data}
                width={width * 0.8}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                style={{
                    marginVertical: 8, borderRadius: 16,
                    backgroundColor: "#E7EFC7", alignSelf: 'center',
                }}
                absolute
            />
            <Text style={{
                marginVertical: 10,
                textAlign: "center",
                fontSize: 16,
                color:  Colors[currentTheme].colorTitleTab
            }}>Hours focused in the past week</Text>
            <LineChart
                data={data7Days}
                width={width * 0.8}
                height={220}
                verticalLabelRotation={20}
                chartConfig={chartConfigLine}
                bezier
                // withShadow={false}
                style={{
                    marginVertical: 8, borderRadius: 16,
                    backgroundColor: "#E7EFC7", alignSelf: 'center',
                }}
            />
            <Text style={{
                marginVertical: 10,
                textAlign: "center",
                fontSize: 16,
                color:  Colors[currentTheme].colorTitleTab
            }}>Daily task activity over the past 90 days</Text>
            <ContributionGraph
                values={commitsData}
                endDate={new Date()}
                numDays={30}
                width={width * 0.8}
                height={220}
                chartConfig={chartConfig3}
                tooltipDataAttrs={() => ({})}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    backgroundColor: "#E7EFC7",
                    alignSelf: 'center',
                }}
                showMonthLabels={false}
                horizontal={false}
                gutterSize={3}
                squareSize={35}
            />
        </ScrollView>
    )
}
