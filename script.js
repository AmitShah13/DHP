document.addEventListener("DOMContentLoaded", function () {
    const viewTrendsBtn = document.getElementById("viewTrendsBtn");
    const backBtn = document.getElementById("backBtn");
    const home = document.getElementById("home");
    const graphView = document.getElementById("graphView");
    let chartInstance = null;

    viewTrendsBtn.addEventListener("click", () => {
        home.classList.add("hidden");
        graphView.classList.remove("hidden");
        loadGraph();
    });

    backBtn.addEventListener("click", () => {
        graphView.classList.add("hidden");
        home.classList.remove("hidden");
    });

    function loadGraph() {
        fetch("https://amitkumardhp.pythonanywhere.com/data")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const years = Object.keys(data);
                const tags = Object.keys(data[years[0]]);

                const datasets = tags.map(tag => ({
                    label: tag,
                    data: years.map(year => data[year][tag] || 0),
                    borderColor: getRandomColor(),
                    backgroundColor: 'transparent',
                    pointBorderColor: '#666',
                    pointBackgroundColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.4,
                    fill: false
                }));

                const ctx = document.getElementById("lineChart").getContext("2d");

                if (chartInstance) chartInstance.destroy();

                chartInstance = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: years,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                            duration: 1500,
                            easing: 'easeOutQuart'
                        },
                        plugins: {
                            tooltip: {
                                enabled: true,
                                backgroundColor: "#fff",
                                titleColor: "#000",
                                bodyColor: "#222",
                                borderColor: "#ccc",
                                borderWidth: 1,
                                callbacks: {
                                    label: function (context) {
                                        const value = context.parsed.y.toFixed(2);
                                        return `${context.dataset.label}: ${value}%`;
                                    }
                                }
                            },
                            legend: {
                                position: "bottom",
                                labels: {
                                    color: "#333",
                                    font: { size: 13 }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: "#444",
                                    callback: value => `${value}%`,
                                    font: { size: 13 }
                                },
                                title: {
                                    display: true,
                                    text: "Percentage (%)",
                                    color: "#222",
                                    font: { size: 14 }
                                },
                                grid: { color: "rgba(0,0,0,0.05)" }
                            },
                            x: {
                                ticks: {
                                    color: "#444",
                                    font: { size: 13 }
                                },
                                title: {
                                    display: true,
                                    text: "Year",
                                    color: "#222",
                                    font: { size: 14 }
                                },
                                grid: { color: "rgba(0,0,0,0.05)" }
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                document.body.innerHTML += "<p style='color:red;'>Error loading data. Please try again later.</p>";
            });
    }

    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 50%)`;
    }
});
