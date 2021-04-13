<template>
  <canvas ref="canvasRef" />
</template>

<script>
import { ref, toRefs, watch, onMounted } from "vue";
import { zonedTimeToUtc, format, utcToZonedTime } from "date-fns-tz";
import { addDays, eachDayOfInterval, max, parse, parseISO } from "date-fns";
import {
  BarController,
  BarElement,
  Chart,
  CategoryScale,
  Legend,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  TimeScale,
  Title,
  Tooltip
);

Chart.defaults.font.family = "'Montserrat', sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.color = "rgba(10,10,10,.75)";

export default {
  name: "PingChart",
  props: {
    createDate: {
      type: String,
      //   default: () => Date.now(),
      required: true,
    },
    days: {
      type: Number,
      default: 7,
      required: false,
    },
    pings: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  setup(props) {
    const { createDate, days, pings } = toRefs(props);
    const canvasRef = ref();
    let pingChart;

    onMounted(() => {
      watch(
        [createDate, days, pings],
        ([createDate, days, pings], [prevCreateDate, prevDays, prevPings]) => {
          let end, maxTick, minTick, playsByDay, start, x, y, yMax;

          function renderChart() {
            if (typeof pingChart !== "undefined") pingChart.destroy();
            start = max([
              zonedTimeToUtc(
                addDays(Date.now(), -1 * days),
                Intl.DateTimeFormat().resolvedOptions().timeZone
              ),
              zonedTimeToUtc(
                parseISO(createDate),
                Intl.DateTimeFormat().resolvedOptions().timeZone
              ),
            ]);

            end = zonedTimeToUtc(Date.now(), Intl.DateTimeFormat().resolvedOptions().timeZone);
            playsByDay = pings.reduce((accum, i) => {
              accum[i.day] = i.plays;
              return accum;
            }, []);
            x = eachDayOfInterval({
              start: utcToZonedTime(start, "UTC"),
              end: utcToZonedTime(end, "UTC"),
            }).map((day) => format(day, "MM/dd/yyyy"));

            y = x.map((day) => playsByDay[day] || 0);
            yMax = Math.max(...y);
            minTick = format(addDays(utcToZonedTime(start, "UTC"), -1), "MM/dd/yyyy");
            maxTick = format(addDays(utcToZonedTime(end, "UTC"), 1), "MM/dd/yyyy");
            pingChart = new Chart(canvasRef.value, {
              type: "bar",
              data: {
                labels: x,
                datasets: [
                  {
                    label: "Plays",
                    data: y,
                    barThickness: "flex",
                    maxBarThickness: 40,
                    minBarLength: 2,
                    backgroundColor: "rgba(170, 84, 255, .15)",
                    borderColor: "rgba(113, 28, 255, .75)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(113, 28, 255, 1.0)",
                    hoverBorderWidth: 0,
                  },
                ],
              },
              options: {
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                      // color: "rgba(255, 0, 0, 1.0)",
                      boxWidth: 20,
                      font: {
                        family: "'Montserrat', sans-serif",
                        lineHeight: 1,
                        size: 13,
                        weight: "400",
                      },
                    },
                  },
                  title: {
                    align: "center",
                    color: "rgba(0,0,0,1.0)",
                    display: true,
                    font: {
                      family: "'Montserrat', sans-serif",
                      lineHeight: 1.15,
                      size: 26,
                      weight: "500",
                    },
                    padding: 24,
                    position: "top",
                    text: "Daily Activity",
                  },
                  tooltip: {
                    callbacks: {
                      title: function (tooltipItems) {
                        return format(
                          zonedTimeToUtc(
                            parse(tooltipItems[0].label, "MMM dd, yyyy, h:mm:ss aaaa", new Date()),
                            Intl.DateTimeFormat().resolvedOptions().timeZone
                          ),
                          "EEE, LLL do"
                        );
                      },
                    },
                  },
                },
                animation: {
                  easing: "easeInQuart",
                },
                scales: {
                  x: {
                    gridLines: {
                      offsetGridLines: false,
                    },
                    type: "time",
                    ticks: {
                      fontSize: 12,
                      max: maxTick,
                      maxRotation: 180,
                      maxTicksLimit: 5,
                      min: minTick,
                      minRotation: 0,
                    },
                    time: {
                      unit: "week",
                      parser: "MM/dd/yyyy",
                      isoWeekday: true,
                      displayFormats: {
                        week: "E, MMM d",
                      },
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Date (GMT/UTC)",
                    },
                  },
                  y: {
                    type: "linear",
                    ticks: {
                      beginAtZero: true,
                      fontSize: 12,
                      maxTicksLimit: 5,
                      precision: 0,
                      suggestedMax: Math.max(yMax + yMax / 5, 10),
                    },
                  },
                },
              },
            });
          }
          renderChart();
          // });
        },
        { immediate: true }
      );
    });

    return {
      canvasRef,
    };
  },
};
</script>

<style lang="scss" scoped></style>
