<script lang="ts">
  import Icon from "@iconify/svelte";

  let {
    mediaType = $bindable(undefined),
  }: { mediaType: "gallery" | "poster" | undefined } = $props();

  let cardTypes = [
    {
      type: "gallery",
      icon: "material-symbols-light:gallery-thumbnail-outline-rounded",
      label: "IDE Photos",
    },
    {
      type: "poster",
      icon: "material-symbols-light:aspect-ratio-outline-rounded",
      label: "Announcement",
    },
  ];
</script>

<h2 class="text-lg font-bold mb-4">Select Media Type</h2>
<div class="flex items-start gap-4">
  {#each cardTypes as card}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <label
      class="custom-option card border-primary border-opacity-50 text-primary border bg-transparent shadow-none cursor-pointer bg-primary bg-opacity-0 transition flex flex-col items-center justify-center w-auto basis-32 pt-2"
      class:bg-opacity-10={mediaType === card.type}
    >
      <Icon icon={card.icon} class="w-full max-w-32 h-auto" />
      <h3 class="text-center opacity-90 text-xs font-mono">
        {card.label}
      </h3>
      <input
        type="radio"
        bind:group={mediaType}
        value={card.type}
        class="radio hidden"
      />
    </label>
  {/each}
</div>
