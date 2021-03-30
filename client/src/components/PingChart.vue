<template>
  <canvas ref="canvasRef" />
</template>

<script>
import { ref, toRefs, watch, onMounted } from "vue";
import { zonedTimeToUtc, format, utcToZonedTime } from "date-fns-tz";
import { addDays, eachDayOfInterval, max, parse, parseISO } from "date-fns";
import Chart from "chart.js";

export default {
  name: "PingChart",
  props: {
    createDate: {
      type: String,
      //   default: () => Date.now(),
      required: true,
    },
    pings: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  setup(props) {
    const { createDate, pings } = toRefs(props);
    const canvasRef = ref();
    let pingChart;

    onMounted(() => {
      watch(
        [createDate, pings],
        ([createDate, pings], [prevCreateDate, prevPings]) => {
          let end, maxTick, minTick, playsByDay, start, x, y, yMax;

          function renderChart() {
            if (typeof pingChart !== "undefined") pingChart.destroy();
            start = max([
              zonedTimeToUtc(
                addDays(Date.now(), -30),
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
                responsive: true,
                title: {
                  display: true,
                  fontSize: 18,
                  fontStyle: "normal",
                  fontFamily: "'marcher-medium', sans-serif",
                  lineHeight: 1.3,
                  position: "top",
                  text: "Daily Activity",
                },
                tooltips: {
                  callbacks: {
                    title: function (tooltipItem) {
                      return format(
                        zonedTimeToUtc(
                          parse(tooltipItem[0].xLabel, "MM/dd/yyyy", new Date()),
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                        ),
                        "EEE, LLL do"
                      );
                    },
                  },
                },
                legend: {
                  display: true,
                },
                animation: {
                  easing: "easeInQuart",
                },
                scales: {
                  xAxes: [
                    {
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
                        parser: "MM/DD/YYYY",
                        isoWeekday: true,
                        displayFormats: {
                          week: "ddd, MMM D",
                        },
                      },
                      scaleLabel: {
                        display: true,
                        labelString: "Date (GMT/UTC)",
                      },
                    },
                  ],
                  yAxes: [
                    {
                      type: "linear",
                      ticks: {
                        beginAtZero: true,
                        fontSize: 12,
                        maxTicksLimit: 5,
                        precision: 0,
                        suggestedMax: Math.max(yMax + yMax / 5, 10),
                      },
                    },
                  ],
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
