<script lang="ts">
  import Icon from "@iconify/svelte";
  import MediaType from "$lib/components/mediaType.svelte";
  import Upload from "$lib/components/upload.svelte";
  import { fade } from "svelte/transition";
  import { enhance } from "$app/forms";
  import type { ScreenData } from "$lib/screens.svelte.js";
  import Screen from "$lib/components/screen.svelte";
  let {
    screen,
    canSetStatus,
    reloadOnSave = false,
  }: {
    screen: ScreenData;
    canSetStatus: boolean;
    reloadOnSave?: boolean;
  } = $props();

  let projectData = $state(JSON.parse(JSON.stringify(screen)) as ScreenData);

  let mediaType = $state(
    // svelte-ignore state_referenced_locally
    projectData.foreground ? ("poster" as const) : ("gallery" as const)
  );

  let fileData = $state<File>();
  let saving = $state(false);

  let dirtyState = $derived(
    JSON.stringify(projectData) !== JSON.stringify(screen) || fileData
  );
</script>

<div class="card border p-4 text-base-content">
  <MediaType bind:mediaType />
  <div class="w-96 my-4">
    <label class="label label-text" for="name"> Name </label>
    <input
      type="text"
      placeholder="What is this a photo/video of?"
      class="input"
      id="name"
      bind:value={projectData.Name}
    />
  </div>
  {#if mediaType === "gallery"}
    <!-- Gallery-only options -->
  {:else if mediaType === "poster"}
    <!-- More details to go here -->
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
  {/if}
  <Upload
    bind:data={projectData}
    bind:fileType={projectData.content_type}
    bind:fileData
  />
  <!-- Save button -->

  <form
    method="POST"
    enctype="multipart/form-data"
    action="?/update"
    use:enhance={async ({ formData }) => {
      saving = true;
      console.log("Saving", projectData);
      debugger;
      if (fileData && projectData.content_type !== "iframe")
        formData.append("file", fileData as Blob);
      return async ({ result, update }) => {
        // `result` is an `ActionResult` object
        // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
        // Wait 1s for propogation
        if (reloadOnSave) {
          await update({ invalidateAll: true });
          window.location.reload();
        } else if (result.type === "redirect") {
          await update({ invalidateAll: true });
        } else if (result.type !== "success") {
          alert("Error saving changes. Please try again.");
        }
        setTimeout(async () => {
          saving = false;
          await update({ invalidateAll: true });
        }, 1000);
      };
    }}
  >
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
