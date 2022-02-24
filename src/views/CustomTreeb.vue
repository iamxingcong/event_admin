<template>
  <div id="container"></div>
</template>
<script>
import G6 from "@antv/g6";
export default {
  name: "CustomTreeb",

  created() {
    this.draw();
  },

  methods: {
    canvast(mockData) {
      // mocked data
     
     
      const colors = {
        B: "#5B8FF9",
        R: "#F46649",
        Y: "#EEBC20",
        G: "#5BD8A6",
        DI: "#A7A7A7",
      };
      console.log(mockData);
      //  组件props
      const props = {
        data: mockData,
        config: {
          padding: [20, 50],
          defaultLevel: 3,
          defaultZoom: 0.8,
          modes: { default: ["zoom-canvas", "drag-canvas"] },
        },
      };

      const container = document.getElementById("container");
      console.log(container);
      const width = window.screen.width;
      const height = 1500;

      // 默认配置
      const defaultConfig = {
        width,
        height,
        linkCenter: true,
        modes: {
          default: ["zoom-canvas", "drag-canvas"],
        },
        fitView: true,
        animate: true,
        defaultNode: {
          type: "flow-rect",
        },
        defaultEdge: {
          type: "cubic-vertical",
          style: {
            stroke: "#CED4D9",
          },
        },
        layout: {
           
          
          direction: 'TB',
          nodeSep: 60,
          rankSep: 100,
            dropCap: false,
          indent: 300,
          type: "compactBox",
       //   type: 'dendrogram',

          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 90;
          },
          getWidth: function getWidth() {
            return 56;
          },
          getVGap: function getVGap() {
            return 30;
          },
          getHGap: function getHGap() {
            return 130;
          },

       
        },
      };

      // 自定义节点、边
      const registerFn = () => {
        /**
         * 自定义节点
         */
        G6.registerNode(
          "flow-rect",
          {
            shapeType: "flow-rect",
            draw(cfg, group) {
              const {
                name = "",

                value,

                collapsed,

                status = "B",
              } = cfg;
              const grey = "#CED4D9";
              // 逻辑不应该在这里判断
              const rectConfig = {
                width: 202,
                height: 60,
                lineWidth: 1,
                fontSize: 12,
                fill: "#fff",
                radius: 4,
                stroke: grey,
                opacity: 1,
              };

              const nodeOrigin = {
                x: (-rectConfig.width / 2) + 101,
                y: (-rectConfig.height / 2 ) - 30,
              };

              const textConfig = {
                textAlign: "left",
                textBaseline: "bottom",
              };

              const rect = group.addShape("rect", {
                attrs: {
                  x: nodeOrigin.x,
                  y: nodeOrigin.y,
                  ...rectConfig,
                },
              });

              const rectBBox = rect.getBBox();

              // percentage
              const percentText = group.addShape("text", {
                attrs: {
                  ...textConfig,
                  x: rectBBox.maxX - 8,
                  y: rectBBox.maxY - 12,
                  text: `${((value || 0) * 1).toFixed(2)}%`,
                  fontSize: 12,
                  textAlign: "right",
                  fill: colors[status],
                },
              });
              console.log(typeof percentText);

              // bottom percent
              const bottomRect = group.addShape("rect", {
                attrs: {
                  x: nodeOrigin.x,
                  y: nodeOrigin.y,

                  width:
                    value * rectBBox.width * 0.01 < 202
                      ? value * rectBBox.width * 0.01
                      : 202,
                  height: 60,
                  radius: [rectConfig.radius, 0, 0, rectConfig.radius],
                  fill: colors[status],
                },

                
              });

              console.log(typeof bottomRect);

              // label title
              group.addShape("text", {
                attrs: {
                  ...textConfig,
                  x: 12 + nodeOrigin.x,
                  y: 20 + nodeOrigin.y,
                  text: name.length > 28 ? name.substr(0, 28) + "..." : name,
                  fontSize: 12,
                  opacity: 1,

                  fill: "#000",
                  cursor: "pointer",
                },
                name: "name-shape",
              });

              // collapse rect
              if (cfg.children && cfg.children.length) {
                group.addShape("rect", {
                  attrs: {
                    x: rectConfig.width / 2 - 8,
                    y: -8,
                    width: 16,
                    height: 16,
                    stroke: "rgba(0, 0, 0, 0.25)",
                    cursor: "pointer",
                    fill: "#fff",
                  },
                  name: "collapse-back",
                  modelId: cfg.id,
                });

                // collpase text
                group.addShape("text", {
                  attrs: {
                    x: rectConfig.width / 2,
                    y: -1,
                    textAlign: "center",
                    textBaseline: "middle",
                    text: collapsed ? "+" : "-",
                    fontSize: 16,
                    cursor: "pointer",
                    fill: "rgba(0, 0, 0, 0.25)",
                  },
                  name: "collapse-text",
                  modelId: cfg.id,
                });
              }

              this.drawLinkPoints(cfg, group);
              return rect;
            },
            update(cfg, item) {
              const group = item.getContainer();
              this.updateLinkPoints(cfg, group);
            },
            setState(name, value, item) {
              if (name === "collapse") {
                const group = item.getContainer();
                const collapseText = group.find(
                  (e) => e.get("name") === "collapse-text"
                );
                if (collapseText) {
                  if (!value) {
                    collapseText.attr({
                      text: "-",
                    });
                  } else {
                    collapseText.attr({
                      text: "+",
                    });
                  }
                }
              }
            },
            getAnchorPoints() {
              return [
                [0.5, 0],
                [0.5, 0],
              ];
            },
          },
          "rect"
        );

        G6.registerEdge(
          "flow-cubic",
          {
            getControlPoints(cfg) {
              let controlPoints = cfg.controlPoints; // 指定controlPoints
              if (!controlPoints || !controlPoints.length) {
                const { startPoint, endPoint, sourceNode, targetNode } = cfg;
                const {
                  x: startX,
                  y: startY,
                  coefficientX,
                  coefficientY,
                } = sourceNode ? sourceNode.getModel() : startPoint;
                const { x: endX, y: endY } = targetNode
                  ? targetNode.getModel()
                  : endPoint;
                let curveStart = (endX - startX ) * coefficientX ;
                let curveEnd = (endY - startY) * coefficientY + 600;
                curveStart = curveStart > 40 ? 40 : curveStart;
                curveEnd = curveEnd < -30 ? curveEnd : -30;
                controlPoints = [
                  { x: startPoint.x + curveStart, y: startPoint.y },
                  { x: endPoint.x + curveEnd, y: endPoint.y },
                ];
              }
              return controlPoints;
            },
            getPath(points) {
              const path = [];
              path.push(["M", points[0].x, points[0].y]);
              path.push([
                "C",
                points[1].x,
                points[1].y,
                points[2].x,
                points[2].y,
                points[3].x,
                points[3].y,
              ]);
              return path;
            },
          },
          "single-line"
        );
      };

      registerFn();

      const { data } = props;
      let graph = null;

      const initGraph = (data) => {
        if (!data) {
          return;
        }
        const { onInit, config } = props;
        const tooltip = new G6.Tooltip({
          // offsetX and offsetY include the padding of the parent container
          offsetX: 20,
          offsetY: 30,
          // the types of items that allow the tooltip show up
          // 允许出现 tooltip 的 item 类型
          itemTypes: ["node"],
          // custom the tooltip's content
          // 自定义 tooltip 内容
          getContent: (e) => {
            const outDiv = document.createElement("div");
            //outDiv.style.padding = '0px 0px 20px 0px';
            const nodeName = e.item.getModel().name;
            let formatedNodeName = "";
            for (let i = 0; i < nodeName.length; i++) {
              formatedNodeName = `${formatedNodeName}${nodeName[i]}`;
              if (i !== 0 && i % 20 === 0)
                formatedNodeName = `${formatedNodeName}<br/>`;
            }
            outDiv.innerHTML = `${formatedNodeName}`;
            return outDiv;
          },
          shouldBegin: (e) => {
            if (e.target.get("name") === "name-shape") return true;
            return false;
          },
        });
        graph = new G6.TreeGraph({
          container: "container",
          ...defaultConfig,
          ...config,
          plugins: [tooltip],
        });
        if (typeof onInit === "function") {
          onInit(graph);
        }
        graph.data(data);
        graph.render();
        graph.zoom(config.defaultZoom || 1);

        const handleCollapse = (e) => {
          const target = e.target;
          const id = target.get("modelId");
          const item = graph.findById(id);
          const nodeModel = item.getModel();
          nodeModel.collapsed = !nodeModel.collapsed;
          graph.layout();
          graph.setItemState(item, "collapse", nodeModel.collapsed);
        };
        graph.on("collapse-text:click", (e) => {
          handleCollapse(e);
        });
        graph.on("collapse-back:click", (e) => {
          handleCollapse(e);
        });
      };

      initGraph(data);
    },
    objid(z) {
      z.id = z.id + "";
      let ty = typeof z;
      console.log(ty);

      if (typeof z.children == "object") {
        if (z.children.length >= 1) {
          for (var t = 0; t < z.children.length; t++) {
            z.children[t].id = z.children[t].id + "";
            this.objid(z.children[t]);
          }
        }
      }
      return z;
    },
    async draw() {
      var url = "http://test.api.big.pcg.com/demo/get";
      try {
        const response = await this.axios.get(url);

        console.log(response.data.data);

        let ots = response.data.data;

        this.objid(ots);
        this.canvast(response.data.data);
        console.log(ots);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
