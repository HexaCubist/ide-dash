<script lang="ts">
  // Get children (runes)
  let { children } = $props();
</script>

<div class="sidebar">
  {@render children?.()}
</div>

<style lang="postcss">
  .sidebar {
    @apply absolute z-10 flex flex-row gap-4 overflow-y-hidden;
    --padding: 1rem;
    --clock-width: 18rem;
    top: var(--padding);
    right: var(--padding);
    bottom: var(--padding);
    width: 60rem;
    min-width: calc(40vw - (var(--padding)));
    max-width: calc(100vw - (var(--padding) * 3) - var(--clock-width));
  }
</style>
