import { View } from "react-native"
import React from "react";
import { Dimensions, ScrollView, StatusBar, Text } from "react-native";
import {
	BarChart,
	ContributionGraph,
	LineChart,
	PieChart,
	ProgressChart,
	StackedBarChart
} from "react-native-chart-kit"
const data = {
	labels: ["January", "February", "March", "April", "May", "June"],
	datasets: [
		{
			data: [-50, -20, -2, 86, 71, 100],
			color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})` // optional
		},
		{
			data: [20, 10, 4, 56, 87, 90],
			color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})` // optional
		},
		{
			data: [30, 90, 67, 54, 10, 2]
		}
	],
	legend: ["Rainy Days", "Sunny Days", "Snowy Days"] // optional
};

// Mock data object used for Contribution Graph

const contributionData = [
	{ date: "2016-01-02", count: 1 },
	{ date: "2016-01-03", count: 2 },
	{ date: "2016-01-04", count: 3 },
	{ date: "2016-01-05", count: 4 },
	{ date: "2016-01-06", count: 5 },
	{ date: "2016-01-30", count: 2 },
	{ date: "2016-01-31", count: 3 },
	{ date: "2016-03-01", count: 2 },
	{ date: "2016-04-02", count: 4 },
	{ date: "2016-03-05", count: 2 },
	{ date: "2016-02-30", count: 4 }
];

// Mock data object for Pie Chart

const pieChartData = [
	{
		name: "Seoul",
		population: 21500000,
		color: "rgba(131, 167, 234, 1)",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	},
	{
		name: "Toronto",
		population: 2800000,
		color: "#F00",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	},
	{
		name: "Beijing",
		population: 527612,
		color: "red",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	},
	{
		name: "New York",
		population: 8538000,
		color: "#ffffff",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	},
	{
		name: "Moscow",
		population: 11920000,
		color: "rgb(0, 0, 255)",
		legendFontColor: "#7F7F7F",
		legendFontSize: 15
	}
];

// Mock data object for Progress

const progressChartData = {
	labels: ["Swim", "Bike", "Run"], // optional
	data: [0.2, 0.5, 0.3]
};

const stackedBarGraphData = {
	labels: ["Test1", "Test2"],
	legend: ["L1", "L2", "L3"],
	data: [[60, 60, 60], [30, 30, 60]],
	barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
};

export {
	data,
	contributionData,
	pieChartData,
	progressChartData,
	stackedBarGraphData
};
// in Expo - swipe left to see the following styling, or create your own
const chartConfigs = [
	{
		backgroundColor: "#000000",
		backgroundGradientFrom: "#1E2923",
		backgroundGradientTo: "#08130D",
		color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
		style: {
			borderRadius: 16
		}
	},
	{
		backgroundColor: "#022173",
		backgroundGradientFrom: "#022173",
		backgroundGradientTo: "#1b3fa0",
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: {
			borderRadius: 16
		},
		propsForBackgroundLines: {
			strokeDasharray: "" // solid background lines with no dashes
		}
	},
	{
		backgroundColor: "#ffffff",
		backgroundGradientFrom: "#ffffff",
		backgroundGradientTo: "#ffffff",
		color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
	},
	{
		backgroundColor: "#ffffff",
		backgroundGradientFrom: "#ffffff",
		backgroundGradientTo: "#ffffff",
		color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
	},
	{
		backgroundColor: "#26872a",
		backgroundGradientFrom: "#43a047",
		backgroundGradientTo: "#66bb6a",
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: {
			borderRadius: 16
		}
	},
	{
		backgroundColor: "#000000",
		backgroundGradientFrom: "#000000",
		backgroundGradientTo: "#000000",
		color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
	},
	{
		backgroundColor: "#0091EA",
		backgroundGradientFrom: "#0091EA",
		backgroundGradientTo: "#0091EA",
		color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
	},
	{
		backgroundColor: "#e26a00",
		backgroundGradientFrom: "#fb8c00",
		backgroundGradientTo: "#ffa726",
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: {
			borderRadius: 16
		}
	},
	{
		backgroundColor: "#b90602",
		backgroundGradientFrom: "#e53935",
		backgroundGradientTo: "#ef5350",
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: {
			borderRadius: 16
		}
	}
];

export default function Stats() {

		const { width } = Dimensions.get("window");
		const height = 256;
		return (
			<View>
				{chartConfigs.map(chartConfig => {
					const labelStyle = {
						color: chartConfig.color(),
						marginVertical: 10,
						textAlign: "center",
						fontSize: 16
					};
					const graphStyle = {
						marginVertical: 8,
						...chartConfig.style
					};
					return (
						<ScrollView
							key={Math.random()}
							style={{
								backgroundColor: chartConfig.backgroundColor
							}}
						>
							<Text  style={{
								color: chartConfig.color(),
								marginVertical: 10,
								textAlign: "center",
								fontSize: 16
							}}>Bezier Line Chart</Text>
							<LineChart
								bezier
								data={data}
								width={width}
								height={height}
								yAxisLabel="$"
								yAxisSuffix="k"
								chartConfig={chartConfig}
								style={graphStyle}
								verticalLabelRotation={20}
								formatXLabel={label => label.toUpperCase()}
							/>
							<Text style={{
								color: chartConfig.color(),
								marginVertical: 10,
								textAlign: "center",
								fontSize: 16
							}}>Progress Chart</Text>
							<ProgressChart
								data={progressChartData}
								width={width}
								height={height}
								chartConfig={chartConfig}
								style={graphStyle}
								hideLegend={false}
							/>
							<Text style={{
								color: chartConfig.color(),
								marginVertical: 10,
								textAlign: "center",
								fontSize: 16
							}}>Pie Chart</Text>
							<PieChart
								data={pieChartData}
								height={height}
								width={width}
								chartConfig={chartConfig}
								accessor="population"
								style={graphStyle}
								backgroundColor="transparent"
								paddingLeft="15"
							/>
							<Text style={{
								color: chartConfig.color(),
								marginVertical: 10,
								textAlign: "center",
								fontSize: 16
							}}>Line Chart</Text>
							<LineChart
								data={data}
								width={width}
								height={height}
								yAxisLabel="$"
								chartConfig={chartConfig}
								style={graphStyle}
							/>
							<Text style={{
								color: chartConfig.color(),
								marginVertical: 10,
								textAlign: "center",
								fontSize: 16
							}}>Contribution Graph</Text>
							<ContributionGraph
								values={contributionData}
								width={width}
								height={height}
								endDate={new Date("2016-05-01")}
								numDays={105}
								chartConfig={chartConfig}
								style={graphStyle}
								tooltipDataAttrs={() => ({})}
							/>
							<Text>Line Chart</Text>
							<LineChart
								data={data}
								width={width}
								height={height}
								yAxisLabel="$"
								segments={5}
								chartConfig={chartConfig}
								style={graphStyle}
								hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
							/>
							<Text>
								Line Chart with shadow background as line color
							</Text>
							<LineChart
								bezier
								data={data}
								width={width}
								height={height}
								yAxisLabel="$"
								segments={5}
								chartConfig={{
									...chartConfig,
									useShadowColorFromDataset: true
								}}
								style={graphStyle}
								hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
							/>
						</ScrollView>
					);
				})}
			</View>
		)
}
	