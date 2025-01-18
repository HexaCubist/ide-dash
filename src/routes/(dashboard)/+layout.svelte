<script lang="ts">
  import ide from "../../../static/ide-segments-joined.svg?raw";
  let { children, data } = $props();
</script>

<div class="wrapper" style:background-image="url('/rca-bg.jpg')">
  <div class="section flex items-center justify-center">
    <a class="ide-logo" href="/" title="Back to preview">
      {@html ide}
    </a>
  </div>
  <div class="section h-full">
    {@render children()}
  </div>
</div>

<style lang="postcss">
  .wrapper {
    @apply w-screen h-screen flex gap-4 sm:gap-8 p-4 sm:p-8 flex-wrap bg-gray-800 bg-cover bg-fixed overflow-y-auto overflow-x-hidden sm:flex-row-reverse;
  }
  .section {
    @apply grow shrink w-full basis-96;
  }
  .ide-logo {
    @apply sm:max-w-44 max-w-32;
    :global(svg) {
      @apply overflow-visible;
      width: 100%;
      height: auto;
      fill: white;
      :global(.two, .three) {
        @apply transition;
      }
      :global(.two) {
        --final: translate(1rem, 1rem);
      }
      :global(.three) {
        --final: translate(2rem, 2rem);
      }
      &:hover {
        :global(.two, .three) {
          transform: var(--final);
        }
      }
    }
  }
</style>
