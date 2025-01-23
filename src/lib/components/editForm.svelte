<script lang="ts">
  import Icon from "@iconify/svelte";
  import MediaType from "$lib/components/mediaType.svelte";
  import Upload from "$lib/components/upload.svelte";
  import { fade } from "svelte/transition";
  import { enhance } from "$app/forms";
  import type { ScreenData } from "$lib/screens.svelte.js";
  import Screen from "$lib/components/screen.svelte";
  import { onMount } from "svelte";
  import moment from "moment";
  import flatpickr from "flatpickr";
  import "flatpickr/dist/themes/dark.css";

  let {
    screen = $bindable(),
    canSetStatus,
    onsave = () => {},
  }: {
    screen: ScreenData;
    canSetStatus: boolean;
    onsave?: () => void;
  } = $props();

  let projectData = $state(JSON.parse(JSON.stringify(screen)) as ScreenData);
  $effect(() => {
    projectData = JSON.parse(JSON.stringify(screen)) as ScreenData;
  });

  let mediaType = $state(
    // svelte-ignore state_referenced_locally
    projectData.foreground ? ("poster" as const) : ("gallery" as const)
  );
  $effect(() => {
    projectData.foreground = mediaType === "poster";
  });

  let fileData = $state<File>();
  let saving = $state(false);

  let dirtyState = $derived(
    JSON.stringify(projectData) !== JSON.stringify(screen) || fileData
  );

  let datePicker_end: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (datePicker_end) {
      flatpickr(datePicker_end, {});
    }
  });
</script>

{@debug projectData}

<div class="card border p-4 text-base-content">
  <form
    class="contents"
    method="POST"
    enctype="multipart/form-data"
    action="?/update"
    use:enhance={async ({ formData }) => {
      saving = true;
      console.log("Saving", projectData);
      if (fileData && projectData.content_type !== "iframe")
        formData.append("file", fileData as Blob);
      return async ({ result, update }) => {
        // `result` is an `ActionResult` object
        // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
        // Wait 1s for propogation
        if (result.type === "error" || result.type === "failure") {
          alert("Error saving changes. Please try again.");
        }
        saving = false;
        await update({ invalidateAll: true });
        onsave();
        // setTimeout(async () => {
        // }, 1000);
      };
    }}
  >
    <MediaType bind:mediaType />
    <div class="max-w-96 my-4">
      <label class="label label-text" for="name"> Name* </label>
      <input
        type="text"
        placeholder="What is this a photo/video of?"
        class="input"
        id="name"
        required
        bind:value={projectData.Name}
      />
    </div>
    <div class="max-w-96 my-4">
      <label class="label label-text" for="creator"> Your Name* </label>
      <input
        type="text"
        placeholder="Name and/or contact details here..."
        class="input"
        id="creator"
        required
        bind:value={projectData.creator}
      />
    </div>
    {#if mediaType === "gallery"}
      <!-- Gallery-only options -->
    {:else if mediaType === "poster"}
      <div class="max-w-96 mb-4">
        <label class="label label-text" for="creator"> End Date* </label>
        <input
          type="text"
          class="input max-w-sm"
          placeholder="YYYY-MM-DD"
          value={projectData.schedule_end
            ? moment(projectData.schedule_end).format("YYYY-MM-DD")
            : ""}
          onchange={() => {
            projectData.schedule_end = moment(
              datePicker_end?.value
            ).toISOString();
          }}
          bind:this={datePicker_end}
        />
      </div>
    {/if}
    {#if canSetStatus}
      <div class="max-w-96 mb-4">
        <label class="label label-text" for="status">Status</label>
        <select class="select" id="status" bind:value={projectData.status}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archive">Archive</option>
        </select>
      </div>
      <div class="max-w-96 mb-4">
        <label class="label label-text" for="status">Priority</label>
        <select class="select" id="status" bind:value={projectData.priority}>
          <option value="low">Low (1x)</option>
          <option value="medium">Medium (2x)</option>
          <option value="high">High (3x)</option>
          <option value="vhigh">Very High (5x)</option>
          <option value="infinite">Infinite</option>
        </select>
      </div>
    {/if}
    <Upload
      bind:data={projectData}
      bind:fileType={projectData.content_type}
      bind:fileData
    />
    <!-- Save button -->

    <input type="hidden" name="screenId" value={screen.id} />
    <input
      type="hidden"
      name="screenData"
      value={JSON.stringify(projectData)}
    />
    <div class="flex justify-end gap-4 mt-4">
      <button class="btn btn-gradient btn-primary" disabled={!dirtyState}>
        {#if saving}
          <span class="icon-[tabler--reload] animate-spin"></span>
          Saving
        {:else}
          Save
        {/if}
      </button>
    </div>
  </form>
</div>
