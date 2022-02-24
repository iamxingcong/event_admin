<template>
  <div id="container"></div>
</template>
<script>
import G6 from "@antv/g6";
export default {
  name: "CustomTree",

  created() {
    this.draw();
  },

  methods: {
    canvast(data) {
      const container = document.getElementById("container");
      console.log(container);
      const width = window.screen.width;
      const height = 900;
      const graph = new G6.TreeGraph({
        container: "container",
        width,
        height,
        linkCenter: true,
        modes: {
          default: [
            {
              type: "collapse-expand",
              onChange: function onChange(item, collapsed) {
                const data = item.get("model");
                data.collapsed = collapsed;
                return true;
              },
            },
            "drag-canvas",
            "zoom-canvas",
          ],
        },
        defaultNode: {
          size: 26,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        defaultEdge: {
          type: "cubic-vertical",
        },
        layout: {
          type: "dendrogram",
          direction: "TB", // H / V / LR / RL / TB / BT
          nodeSep: 60,
          rankSep: 180,
        },
      });

      graph.node(function(node) {
        let position = "right";
        let rotate = 0;
        if (node.children.length == 0) {
          position = 'bottom';
          rotate = Math.PI / 2;
        } else {
          position = 'top';
          rotate = Math.PI / 2;
        }
        return {
          label: node.name,
          labelCfg: {
            position,
            offset: 5,
            style: {
              rotate,
              textAlign: "start",
            },
          },
        };
      });

      graph.data(data);
      graph.render();
      graph.fitView();

      if (typeof window !== "undefined")
        window.onresize = () => {
          if (!graph || graph.get("destroyed")) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
    },
    async draw() {
      var url = "http://test.api.big.pcg.com/demo/get";
      try {
        const response = await this.axios.get(url);

        console.log(response.data.data);
        this.canvast(response.data.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
