<script lang="ts">
  import "../app.css";
  let { children, data } = $props();
  console.log("Layout", data.currentScreen);
</script>

{@render children()}
