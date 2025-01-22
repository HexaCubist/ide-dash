<script lang="ts">
  import { page } from "$app/state";
  import { error } from "@sveltejs/kit";
  import Icon from "@iconify/svelte";
  import type { ScreenData } from "$lib/screens.svelte.js";
  import Screen from "$lib/components/screen.svelte";
  import MediaType from "$lib/components/mediaType.svelte";
  import Upload from "$lib/components/upload.svelte";
  import { fade } from "svelte/transition";
  import { enhance } from "$app/forms";
  const { id } = page.params;

  let { data } = $props();

  // Get selected screen
  const screen = data.screenList.find((screen) => screen.id == id);
  if (!screen) {
    error(404, "Screen not found");
  }

  let projectData = $state(
    JSON.parse(JSON.stringify(data.currentScreen)) as ScreenData
  );

  let mediaType = $state(
    // svelte-ignore state_referenced_locally
    projectData.foreground ? ("poster" as const) : ("gallery" as const)
  );

  let fileType = $state<"image" | "video" | "iframe">();
  let fileData = $state<File>();
  let saving = $state(false);

  let dirtyState = $derived(
    JSON.stringify(projectData) !== JSON.stringify(data.currentScreen) ||
      fileData
  );
</script>

<div class="card">
  <div class="card-body">
    <h1 class="card-title flex">
      <p class="grow">Screen Editor</p>

      <a href="../" class="btn btn-text">
        <p class="icon-[tabler--arrow-left]"></p>
        Back
      </a>
    </h1>
    <div
      class="aspect-video max-w-xs mx-auto card overflow-clip pointer-events-none bg-white text-black mb-4"
    >
      {#if screen}
        <Screen {screen}></Screen>
      {/if}
    </div>
    <!-- Edit Form -->
    <div class="card border p-4 text-base-content">
      <MediaType bind:mediaType />
      {#if mediaType === "gallery"}
        <h2 class="text-lg font-bold my-4">Content Details</h2>
        <div class="w-96 mb-4">
          <label class="label label-text" for="name"> Project Name </label>
          <input
            type="text"
            placeholder="What is this a photo/video of?"
            class="input"
            id="name"
            bind:value={projectData.Name}
          />
        </div>
      {:else if mediaType === "poster"}
        <p>Poster</p>
      {/if}
      <Upload bind:data={projectData} bind:fileType bind:fileData />
      <!-- Save button -->

      <form
        method="POST"
        enctype="multipart/form-data"
        use:enhance={async ({ formData }) => {
          saving = true;
          console.log("Saving", projectData);
          if (fileData && fileType !== "iframe")
            formData.append("file", fileData as Blob);
          return async ({ result, update }) => {
            // `result` is an `ActionResult` object
            // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
            // Wait 1s for propogation
            if (result.type !== "success") {
              alert("Error saving changes. Please try again.");
            }
            setTimeout(async () => {
              saving = false;
              await update({ invalidateAll: true });
            }, 1000);
          };
        }}
      >
        <input type="hidden" name="screenId" value={id} />
        <input
          type="hidden"
          name="screenData"
          value={JSON.stringify(projectData)}
        />
        <div class="flex justify-end gap-4 mt-4">
          <button class="btn btn-gradient btn-primary" disabled={!dirtyState}>
            {#if saving}
              <span class="icon-[tabler--spinner] animate-spin"></span>
              Saving
            {:else}
              Save
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
