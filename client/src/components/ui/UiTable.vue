<script>
export default {
  name: "UiTable",
  props: {
    data: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  computed: {
    classes() {
      return {
        "ui-table": true,
      };
    },
  },
  methods: {
    header: ({ data }) => {
      if (!data.length) return;
      return (
        <tr>
          {Object.keys(data[0]).map((column, index) => {
            return <th>{column}</th>;
          })}
        </tr>
      );
    },
    rows: ({ data }) => {
      console.log(JSON.stringify(data));
      return (
        data.length &&
        data.map((item) => {
          return (
            <tr>
              <td>{item.id}</td>
            </tr>
          );
        })
      );
    },
  },
  render() {
    return (
      <table class={this.classes}>
        {this.header({ data: this.data })}
        {this.rows({ data: this.data })}
      </table>
    );
  },
};
</script>

<style lang="scss">
.ui-table {
  border: 1px solid #eee;
  tr,
  th,
  td {
    border: 1px solid #eee;
  }
}
</style>
