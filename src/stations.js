async function getAllStations() {
	try {
		const url = "http://localhost:3000/stations";
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function getStationMetricsById(id) {
	try {
		const url = `http://localhost:3000/stations/${id}/metrics`;
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function deleteStation(id) {
	const url = `http://localhost:3000/stations/${id}`;
	try {
		await fetch(url, { method: "DELETE" });
		displayAllData();
		displayMetrics();
	} catch (error) {
		console.error(error);
	}
}

function renderDataList(data) {
	document.getElementById("list").innerHTML = "";
	const listElement = document.getElementById("list");
	data.map((item) => {
		const listItem = document.createElement("li");
		listItem.id = "station-" + item.id;
		listItem.textContent = `Id: ${item.id}, Address: ${item.address}, Status: ${item.status}  `;

		listElement.appendChild(listItem);
	});
	document.body.appendChild(listElement);
}

async function displayAllData() {
	const data = await getAllStations();
	console.log(data);
	renderDataList(data);
}
async function displayMetrics() {
	const stations = await getAllStations();
	stations.map(async (station) => {
		const metrics = await getStationMetricsById(station.id);

		console.log(station);
		console.log(metrics);

		const button = document.createElement("button");
		button.textContent = "X";
		button.id = "del";
		button.onclick = () => {
			deleteStation(station.id);
		};

		const listItem = document.getElementById("station-" + station.id);

		if (station.status) {
			listItem.innerHTML += `--- Temperature: ${metrics.temoerature}, Dose rate: ${metrics.dose_rate}, Humidity: ${metrics.humidity}`;
		}

		// if (station.status) {
		// 	listItem.innerHTML += `<span> --- Temperature: ${metrics.temoerature}<br> --- Dose rate: ${metrics.dose_rate} <br> --- Humidity: ${metrics.humidity}</ span>`;
		// }

		listItem.appendChild(button);
	});
}

var timeSelect = document.getElementById("time");

timeSelect.addEventListener("change", function () {
	let selectedValue = timeSelect.value;
	setTimer(selectedValue);
});

function getData() {
	displayAllData();
	displayMetrics();
}

function stopTimer() {
	clearInterval(intervalCall);
}
function changeInterval(newInterval) {
	clearInterval(intervalCall);
	intervalCall = setInterval(getData, newInterval);
	getData();
}
function setTimer(value) {
	switch (value) {
		case "none":
			stopTimer();
			break;
		case "5s":
			changeInterval(5000);
			break;
		case "30s":
			changeInterval(30000);
			break;
		case "1m":
			changeInterval(60000);
			break;
		case "30m":
			changeInterval(1800000);
			break;

		default: {
			getData();
			stopTimer();
			break;
		}
	}
}

var intervalCall = setInterval(getData, 5000);
