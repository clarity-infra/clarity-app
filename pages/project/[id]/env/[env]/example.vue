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

            <v-btn key="2">
              Add Load Balancer
            </v-btn>

            <v-btn key="1" @click="createApp">
              Add Application
            </v-btn>
            
          </v-speed-dial>
        </div>
      </div>
    </div>

    <VNavigationDrawer 
      v-model="showNodeDetail" 
      style="background-color: rgba(255, 255, 255, 0.3); backdrop-filter: blur(3px);" 
      temporary 
      :width="$vuetify.display.width"
    >
      <template v-if="selectedNode">
        <VToolbar>
          <VToolbarTitle>{{ selectedNode.label }}</VToolbarTitle>
          <VSpacer />
          <VBtn @click="showNodeDetail = false">Close</VBtn>

          <template #extension>
            <VTabs>
              <VTab>Overview</VTab>
              <VTab disabled>Setting</VTab>
            </VTabs>
            </template>
        </VToolbar>
        
        {{ selectedNode.controls }}
      </template>
    </VNavigationDrawer>
</template>

<script setup lang="ts">
import { NodeEditor, type GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { VuePlugin, Presets, type VueArea2D } from "rete-vue-plugin";
import { ZoomHendler } from "~/composable/ratejs/hendlers/zoom";

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = VueArea2D<Schemes>;


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
    new ZoomHendler(0.5, 200, "cubicBezier(.45,.91,.49,.98)", area)
  );

  area.addPipe(context => {
    if (context.type === 'nodepicked') {
        selectedNode.value = editor.getNode(context.data.id);

        const onMouseMove = () => {
          selectedNode.value = undefined;
          showNodeDetail.value = false;
          revokeTraking()
        }

        const onMouseUp = () => {
          if(selectedNode.value) {
            AreaExtensions.zoomAt(area, [selectedNode.value]);
            showNodeDetail.value = true;
            revokeTraking()
          }
        }

        function revokeTraking() {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }

    return context
  })

  return () => area.destroy();
}

function createApp() {
  
}

const diagram = ref();
const showNodeDetail = ref(false);
const selectedNode = ref<ClassicPreset.Node | undefined>(undefined);

watch(showNodeDetail, (newCondition) => {
    if(!newCondition) {
        selectedNode.value = undefined;
    }
})

onMounted(() => {
    createEditor(diagram.value);
})
</script>