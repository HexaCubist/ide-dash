<script lang="ts">
  import "../app.css";
  let { children } = $props();

  // Refresh page every 30 minutes
  setInterval(
    () => {
      location.reload();
    },
    30 * 60 * 1000
  );
</script>

{@render children()}
