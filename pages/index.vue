<!-- PART OF RESEARCH -->

<template>
    <div class="h-100 w-100">
      <div ref="diagram" class="h-100 w-100"></div>
      <div class="h-100 w-100">
        <div style="position: fixed; bottom: 0; right: 0; width: 80px; height: 80px;">
          <v-speed-dial location="top left" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-fab
                v-bind="activatorProps"
                size="large"
                icon="$vuetify"
              ></v-fab>
            </template>

            <v-btn key="2" icon>
              <v-tooltip
                activator="parent"
                location="start"
              >
                Add Load Balancer
              </v-tooltip>
              <VIcon icon="$info" />
            </v-btn>

            <v-btn key="1" icon>
              <v-tooltip
                activator="parent"
                location="start"
              >
                Add App
              </v-tooltip>
              <VIcon icon="$success" />
            </v-btn>
            
          </v-speed-dial>
        </div>
      </div>
    </div>

   

    <VNavigationDrawer v-model="showNodeDetail" location="right" temporary>
        test {{ selectedNode }}
    </VNavigationDrawer>
</template>

<script setup lang="ts">
import { NodeEditor, type GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions, Zoom } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { VuePlugin, Presets, type VueArea2D } from "rete-vue-plugin";
import anime from "animejs/lib/anime.es.js";

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = VueArea2D<Schemes>;

function screenToArea(x: number, y: number, t: any) {
  const { x: tx, y: ty, k } = t;
  return { x: (x - tx) / k, y: (y - ty) / k };
}

function areaToScreen(x: number, y: number, t: any) {
  const { x: tx, y: ty, k } = t;
  return { x: x * k + tx, y: y * k + ty };
}

class SmoothZoom extends Zoom {
  animation?: any;

  constructor(
    intensity: number,
    private duration: number,
    private easing: string,
    private area: AreaPlugin<any>
  ) {
    super(intensity);
  }


  public override wheel = (e: WheelEvent) => {
    e.preventDefault();

    const isNegative = e.deltaY < 0;
    const delta = isNegative ? this.intensity : -this.intensity;
    const { left, top } = this.container.getBoundingClientRect();
    const ox = e.clientX - left;
    const oy = e.clientY - top;

    const coords = screenToArea(ox, oy, this.area.area.transform);

    const { k } = this.area.area.transform;
    const targets = {
      zoom: k
    };
    const { duration, easing } = this;

    if (this.animation) {
      this.animation.reset();
    }
    this.animation = anime({
      targets,
      x: coords.x,
      y: coords.y,
      zoom: k * (1 + delta),
      duration,
      easing,
      update: () => {
        const currentTransform = this.area.area.transform;

        const coordinates = areaToScreen(coords.x, coords.y, currentTransform);

        const nextX = coordinates.x - coords.x * targets.zoom;
        const nextY = coordinates.y - coords.y * targets.zoom;

        this.area.area.zoom(
          targets.zoom,
          nextX - currentTransform.x,
          nextY - currentTransform.y
        );
      }
    });
  };

  override destroy() {
    super.destroy();
    if (this.animation) {
      this.animation.reset();
    }
  }
}


async function createEditor(container: HTMLElement) {
  if(!container) return;
  const socket = new ClassicPreset.Socket("socket");

  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new VuePlugin<Schemes, AreaExtra>();

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  render.addPreset(Presets.classic.setup());
  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  const a = new ClassicPreset.Node("Example App");
  a.addControl("a", new ClassicPreset.InputControl("text", { initial: "hello-world:latest", readonly: true }));
  a.addOutput("a", new ClassicPreset.Output(socket));
  await editor.addNode(a);

  const b = new ClassicPreset.Node("Load Balancer");
  b.addControl("b", new ClassicPreset.InputControl("text", { initial: "nginx", readonly: true }));
  b.addInput("b", new ClassicPreset.Input(socket));
  await editor.addNode(b);

  await area.translate(b.id, { x: 320, y: 0 });

  await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

  AreaExtensions.zoomAt(area, editor.getNodes());

  area.area.setZoomHandler(
    new SmoothZoom(0.5, 200, "cubicBezier(.45,.91,.49,.98)", area)
  );

  area.addPipe(context => {
    if (context.type === 'nodepicked') {
        selectedNode.value = editor.getNode(context.data.id);
        AreaExtensions.zoomAt(area, [selectedNode.value]);
    }

    return context
  })

  return () => area.destroy();
}

const diagram = ref();
const showNodeDetail = ref(false);
const selectedNode = ref<ClassicPreset.Node | undefined>(undefined);

watch(showNodeDetail, (newCondition) => {
    if(!newCondition) {
        selectedNode.value = undefined;
    }
})

watch(selectedNode, (newCondition) => {
    if(newCondition) {
        showNodeDetail.value = true;
    }
})

onMounted(() => {
    createEditor(diagram.value)
})
</script>